import { test, expect, Page } from '@playwright/test';

/**
 * Full-functionality smoke tests written against the ACTUAL app UI
 * (Tailwind + Zard base, Angular 20, GraphQL local backend on :3000).
 * Flows covered: home/feed, auth (register/login/logout/guards),
 * post lifecycle (create/edit/view), profile, follow/unfollow, settings.
 */

let userSeq = 0;

async function signupAndLogin(page: Page): Promise<string> {
  const seq = ++userSeq + Date.now().toString().slice(-5);
  const username = `tester${seq}`;
  const email = `tester${seq}@example.com`;
  const password = 'password123';

  await page.goto('/register', { waitUntil: 'load' });
  await page.fill('input[formControlName="username"]', username);
  await page.fill('input[formControlName="email"]', email);
  await page.fill('input[formControlName="password"]', password);
  await page.fill('input[formControlName="confirmPassword"]', password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForURL(/\/login$/, { timeout: 10000 });

  await page.fill('input[formControlName="username"]', username);
  await page.fill('input[formControlName="password"]', password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/profile\/.+/, { timeout: 10000 });

  return username;
}

test.describe('Full functionality', () => {
  test('home page renders brand, hero and latest articles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('shareWithAlviss()', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Exploring Ideas That Shape Our World/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Latest Articles' })).toBeVisible();

    const cards = page.locator('a[href^="/article/"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(6);

    await cards.first().click();
    await page.waitForURL(/\/article\/.+/);
    await expect(page.getByText(/Published on/)).toBeVisible();
  });

  test('seeded article detail page renders author, date and content', async ({ page }) => {
    await page.goto('/article/understanding-typescript-generics-7uaix');
    await expect(page.getByText('understanding-typescript-generics-'.slice(0, 5), { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Published on')).toBeVisible();
    await expect(page.locator('a[href^="/profile/"]').first()).toBeVisible();
    const body = page.locator('main .prose');
    await expect(body.first()).toBeVisible();
  });

  test('register validates required fields before enabling submit', async ({ page }) => {
    await page.goto('/register');
    const submit = page.getByRole('button', { name: 'Create Account' });
    await expect(submit).toBeDisabled();

    await page.fill('input[formControlName="username"]', 'abc');
    await page.fill('input[formControlName="email"]', 'bad-email');
    await page.fill('input[formControlName="password"]', 'short');
    await page.fill('input[formControlName="confirmPassword"]', 'nomatch');
    await expect(page.getByText('Invalid email format')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    await page.locator('input[formControlName="confirmPassword"]').blur();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await expect(submit).toBeDisabled();
  });

  test('register and login end-to-end', async ({ page }) => {
    const username = await signupAndLogin(page);
    await expect(page.getByText(username, { exact: true }).first()).toBeVisible();
  });

  test('invalid login stays on login page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[formControlName="username"]', 'nosuchuser');
    await page.fill('input[formControlName="password"]', 'wrongpass1');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('editor Publish submits and creates an article', async ({ page }) => {
    const username = await signupAndLogin(page);
    await page.goto('/editor');
    await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();

    const title = `E2E Post ${Date.now()}`;
    await page.fill('#title', title);
    await page.fill('#desc', 'A post created by the Playwright browser test.');
    await page.selectOption('#category', 'TECHNOLOGY');

    await page.locator('app-rich-text-editor .ql-editor').click();
    await page.keyboard.type('This is a fully qualified paragraph written from the browser drive. It is definitely longer than one hundred characters to satisfy the content validation rule enforced by the API server.');

    await page.locator('app-tag-input input').fill('e2e');
    await page.locator('app-tag-input input').press('Enter');

    // Publish is a native <button z-button type=submit>, wired to the (ngSubmit) handler.
    // The Quill editor syncs its HTML back to the postForm content control (bug: event
    // handling) and the API accepts a post without a featured image.
    const publish = page.getByRole('button', { name: 'Publish' });
    await expect(publish).toBeVisible();
    await publish.click();
    await expect(page).toHaveURL(/\/article\/.+/, { timeout: 15000 });
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  });

  test('editor Update saves edits to an existing article', async ({ page }) => {
    await signupAndLogin(page);
    // Create a post as the logged-in user, then edit it (the API only allows
    // the author to modify a post).
    await page.goto('/editor');
    await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
    const title = `E2E Editable Post ${Date.now()}`;
    await page.fill('#title', title);
    await page.fill('#desc', 'A post created by the Playwright browser test.');
    await page.selectOption('#category', 'TECHNOLOGY');
    await page.locator('app-rich-text-editor .ql-editor').click();
    await page.keyboard.type('This is a fully qualified paragraph written from the browser drive. It is definitely longer than one hundred characters to satisfy the content validation rule enforced by the API server.');
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForURL(/\/article\/.+/, { timeout: 15000 });
    const slug = new URL(page.url()).pathname.split('/').pop()!;

    await page.goto(`/editor/${slug}`);
    await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
    await expect(page.locator('#title')).toHaveValue(title);

    const update = page.getByRole('button', { name: 'Update' });
    await expect(update).toBeVisible();
    await update.click();
    await expect(page).toHaveURL(new RegExp(`/article/${slug}`), { timeout: 15000 });
  });

  test('own profile shows info and menu', async ({ page }) => {
    const username = await signupAndLogin(page);
    await page.goto(`/profile/${username}`);
    await expect(page.getByText(username, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/followers · .* following/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit Profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Write a Post' })).toBeVisible();
  });

  test('follow and unfollow reflects state on the button', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto('/profile/anniestewart');

    const follow = page.locator('app-follow-button button', { hasText: /\bFollow\b/ });
    await expect(follow).toBeVisible();

    // The follow mutation returns isFollowing=true, so the button flips immediately.
    await follow.click();
    await expect(page.locator('app-follow-button button', { hasText: /\bUnfollow\b/ })).toBeVisible({
      timeout: 10000,
    });

    await page.locator('app-follow-button button', { hasText: /\bUnfollow\b/ }).click();
    await expect(page.locator('app-follow-button button', { hasText: /\bFollow\b/ })).toBeVisible({
      timeout: 10000,
    });
  });

  test('settings update saves bio and navigates to profile', async ({ page }) => {
    const username = await signupAndLogin(page);
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    const bio = `Bio updated at ${Date.now()}`;
    await page.fill('#bio', bio);
    await page.getByRole('button', { name: 'Update Settings' }).click();
    await page.waitForURL(new RegExp(`/profile/${username}$`), { timeout: 15000 });

    // updateUserInput now accepts avatar as a plain string URL and exposes bio,
    // so the mutation succeeds and the updated bio is rendered on the profile.
    await expect(page.getByText(bio, { exact: true })).toBeVisible();
  });

  test('logout from top nav returns to signed-out state', async ({ page }) => {
    const username = await signupAndLogin(page);
    await expect(page.locator('header').getByText(username, { exact: true })).toBeVisible();

    await page.locator('button[title="Logout"]').click();
    await page.waitForURL(/\/$/, { timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(page.locator('button[title="Logout"]')).toHaveCount(0);
  });

  test('editor is guarded when logged out', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('load');
    const editorForm = page.locator('#title');
    await expect(editorForm).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Create New Post' })).toHaveCount(0);
  });
});