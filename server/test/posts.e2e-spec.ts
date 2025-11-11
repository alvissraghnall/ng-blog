import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Category } from 'posts/enum/category.enum';
import { useContainer } from 'class-validator';
import util from 'util';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let dataSource: DataSource;
  let authToken: string;
  let secondUserToken: string;
  let userId: string;
  let secondUserId: string;
  let createdPostId: number;
  let secondUserPostId: number;

  const gqlRequest = (query: string, token?: string, variables?: object) => {
    const req = request(httpServer).post('/graphql').send({ query, variables });
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    return req;
  };

  const REGISTER_MUTATION = `
    mutation Register($input: CreateUserInput!) {
      signup(createUserInput: $input) {
          id
          username
          email
      }
    }
  `;

  const LOGIN_MUTATION = `
    mutation Login($input: LoginUserInput!) {
      login(loginUserInput: $input) {
        access_token
        user {
          id
          username
          email
        }
      }
    }
  `;

  const CREATE_POST_MUTATION = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(createPostInput: $input) {
        id
        title
        content
        image
        desc
        tags {
          id
          name
        }
        category
        author {
          id
          username
        }
        likeCount
        commentCount
      }
    }
  `;

  const UPDATE_POST_MUTATION = `
    mutation UpdatePost($input: UpdatePostInput!) {
      updatePost(updatePostInput: $input) {
        id
        title
        content
        image
        desc
        category
        author {
          id
          username
        }
      }
    }
  `;

  const DELETE_POST_MUTATION = `
    mutation RemovePost($id: Int!) {
      removePost(id: $id) {
        id
        title
      }
    }
  `;

  const GET_POSTS_QUERY = `
    query GetPosts($category: Category, $authorId: String, $limit: Int, $offset: Int) {
      posts(category: $category, authorId: $authorId, limit: $limit, offset: $offset) {
        id
        title
        content
        image
        desc
        tags {
          id
          name
        }
        category
        author {
          id
          username
        }
        likeCount
        commentCount
      }
    }
  `;

  const GET_POST_QUERY = `
    query GetPost($id: Int!) {
      post(id: $id) {
        id
        title
        content
        image
        desc
        tags {
          id
          name
        }
        category
        author {
          id
          username
          email
        }
        likes {
          id
          owner {
            id
            username
          }
        }
        comments {
          id
          text
          author {
            id
            username
          }
        }
        likeCount
        commentCount
      }
    }
  `;

  const GET_POSTS_BY_AUTHOR_QUERY = `
    query GetPostsByAuthor($authorId: String!, $limit: Int) {
      postsByAuthor(authorId: $authorId, limit: $limit) {
        id
        title
        category
        tags {
          id
          name
        }
        author {
          id
          username
        }
      }
    }
  `;

  const GET_POSTS_BY_CATEGORY_QUERY = `
    query GetPostsByCategory($category: Category!, $limit: Int) {
      postsByCategory(category: $category, limit: $limit) {
        id
        title
        category
        tags {
          id
          name
        }
        author {
          id
          username
        }
      }
    }
  `;

  const GET_POPULAR_POSTS_QUERY = `
    query GetPopularPosts($limit: Int) {
      popularPosts(limit: $limit) {
        id
        tags {
          id
          name
        }
        title
        likeCount
        author {
          id
          username
        }
      }
    }
  `;

  const GET_RECENT_POSTS_QUERY = `
    query GetRecentPosts($limit: Int) {
      recentPosts(limit: $limit) {
        id
        title
        createdAt
        tags {
          id
          name
        }
        author {
          id
          username
        }
      }
    }
  `;

  const GET_POST_COUNT_QUERY = `
    query GetPostCount($category: Category, $authorId: String) {
      postCount(category: $category, authorId: $authorId)
    }
  `;

  const validPostData = {
    title: 'Test Blog Post Title',
    content: `This is a test blog post content that meets the minimum length requirement of 100 characters. 
	  It provides enough detail to demonstrate proper formatting, readability, and completeness 
	  for testing purposes within a content management or publishing system.`,
    image: 'https://example.com/image.jpg',
    tags: ['tech', 'bismillah', 'great-britain'],
    desc: 'This is a test description for the blog post',
    category: 'TECHNOLOGY',
  };

  const secondPostData = {
    title: 'Another Test Post',
    content: `This is a test blog post content that meets the minimum length requirement of 100 characters. 
	  It provides enough detail to demonstrate proper formatting, readability, and completeness 
	  for testing purposes within a content management or publishing system.`,
    image: 'https://example.com/another-image.jpg',
    tags: ['tech', 'bismillah', 'bizarre'],
    desc: 'Another test description — but for second user haha',
    category: 'LIFESTYLE',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          const detailed = errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
            children: error.children,
          }));

          const messages = errors.flatMap((e) =>
            Object.values(e.constraints || {}),
          );

          // If there are any constraint messages, prefer ~~
          if (messages.length > 0) {
            return new BadRequestException(messages.join(', '));
          }

          // Otherwise fall back to detailed structure (like nested validation)
          return new BadRequestException({
            message: 'Validation failed',
            errors: detailed,
          });
        },
      }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
    httpServer = app.getHttpServer();
    dataSource = moduleFixture.get<DataSource>(DataSource);

    const registerResponse = await gqlRequest(REGISTER_MUTATION, '', {
      input: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
      },
    });
    console.log(registerResponse.body);
    const loginMutationResponse = await gqlRequest(LOGIN_MUTATION, '', {
      input: {
        username: 'testuser',
        password: 'TestPassword123!',
      },
    });

    console.log(loginMutationResponse.body);
    authToken = loginMutationResponse.body.data.login.access_token;
    userId = registerResponse.body.data.signup.id;

    const secondRegisterResponse = await gqlRequest(REGISTER_MUTATION, '', {
      input: {
        username: 'seconduser',
        email: 'seconduser@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
      },
    });
    const secondLoginMutationResponse = await gqlRequest(LOGIN_MUTATION, '', {
      input: {
        username: 'seconduser',
        password: 'TestPassword123!',
      },
    });

    secondUserToken = secondLoginMutationResponse.body.data.login.access_token;
    secondUserId = secondRegisterResponse.body.data.signup.id;
    console.log(secondUserId);
  }, 15000);

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "like"');
      await dataSource.query('DELETE FROM "comment"');
      await dataSource.query('DELETE FROM "post_tags"');
      await dataSource.query('DELETE FROM "tag"');
      await dataSource.query('DELETE FROM "post"');
      await dataSource.query('DELETE FROM "user"');
    }

    await app.close();
  });

  describe('Create Post', () => {
    it('should create a post with valid data', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: validPostData,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createPost).toMatchObject({
        title: validPostData.title,
        content: validPostData.content,
        image: validPostData.image,
        desc: validPostData.desc,
        tags: expect.arrayContaining([
          expect.objectContaining({
            name: validPostData.tags[0],
          }),
        ]),
        category: validPostData.category,
        author: {
          id: userId,
          username: 'testuser',
        },
        likeCount: 0,
        commentCount: 0,
      });
      expect(response.body.data.createPost.id).toBeDefined();

      createdPostId = response.body.data.createPost.id;
    });

    it('should create a post for second user', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, secondUserToken, {
        input: secondPostData,
      });
      console.log(util.inspect(response.body, { depth: null }));
      console.log(
        response.body.data.createPost,
        response.body.data.createPost.author,
      );

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createPost.author.id).toBe(secondUserId);

      secondUserPostId = response.body.data.createPost.id;
    });

    it('should fail to create post without authentication', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, '', {
        input: validPostData,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Invalid Authorization Header',
      );
    });

    it('should fail with title too short', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, title: 'ab' },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toMatch(/title/i);
      expect(error.message).toMatch(/must be longer than or equal to/i);
      expect(error.path).toEqual(['createPost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with title too long', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, title: 'a'.repeat(101) },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toMatch(/title/i);
      expect(error.message).toMatch(/must be shorter than or equal to/i);
      expect(error.path).toEqual(['createPost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with content too short', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, content: 'Too short' },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toMatch(/content/i);
      expect(error.message).toMatch(/must be longer than or equal to/i);
      expect(error.path).toEqual(['createPost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with content too long', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, content: 'a'.repeat(50001) },
      });

      console.log(util.inspect(response.body, { depth: null }));

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toMatch(/content/i);
      expect(error.message).toMatch(/must be shorter than or equal to/i);
      expect(error.path).toEqual(['createPost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with empty image', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, image: '' },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toMatch(/image/i);
      expect(error.message).toMatch(/empty|required/i);
      expect(error.path).toEqual(['createPost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with empty description', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, desc: '' },
      });

      console.log(util.inspect(response.body, { depth: null }));

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];
      expect(error.message).toMatch(/desc|description/i);
      expect(error.message).toMatch(/empty|required/i);
      expect(error.path).toEqual(['createPost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with invalid category', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { ...validPostData, category: 'INVALID_CATEGORY' },
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail with missing required fields', async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: { title: 'Test' },
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Get Posts', () => {
    it('should get all posts without authentication (public)', async () => {
      const response = await gqlRequest(GET_POSTS_QUERY);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      expect(response.body.data.posts.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter posts by category', async () => {
      const response = await gqlRequest(GET_POSTS_QUERY, '', {
        category: 'TECHNOLOGY',
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      response.body.data.posts.forEach((post: any) => {
        expect(post.category).toBe(Category.TECHNOLOGY);
      });
    });

    it('should filter posts by author', async () => {
      const response = await gqlRequest(GET_POSTS_QUERY, '', {
        authorId: userId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      response.body.data.posts.forEach((post: any) => {
        expect(post.author.id).toBe(userId);
      });
    });

    it('should filter posts by category and author', async () => {
      const response = await gqlRequest(GET_POSTS_QUERY, '', {
        category: 'TECHNOLOGY',
        authorId: userId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      response.body.data.posts.forEach((post: any) => {
        expect(post.category).toBe(Category.TECHNOLOGY);
        expect(post.author.id).toBe(userId);
      });
    });

    it('should apply limit to posts', async () => {
      const response = await gqlRequest(GET_POSTS_QUERY, '', { limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.posts.length).toBe(1);
    });

    it('should apply offset to posts', async () => {
      const allPostsResponse = await gqlRequest(GET_POSTS_QUERY);
      const offsetResponse = await gqlRequest(GET_POSTS_QUERY, '', {
        offset: 1,
      });

      expect(offsetResponse.status).toBe(200);
      expect(offsetResponse.body.errors).toBeUndefined();
      expect(offsetResponse.body.data.posts.length).toBe(
        allPostsResponse.body.data.posts.length - 1,
      );
    });

    it('should get single post by id', async () => {
      const response = await gqlRequest(GET_POST_QUERY, '', {
        id: createdPostId,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.post).toMatchObject({
        id: createdPostId,
        title: validPostData.title,
        content: validPostData.content,
        category: validPostData.category,
      });
      expect(response.body.data.post.author).toBeDefined();
      expect(response.body.data.post.likes).toBeDefined();
      expect(response.body.data.post.comments).toBeDefined();
    });

    it('should fail to get non-existent post', async () => {
      const response = await gqlRequest(GET_POST_QUERY, '', { id: 99999 });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain('not found');
    });
  });

  describe('Get Posts by Author', () => {
    it('should get posts by specific author', async () => {
      const response = await gqlRequest(GET_POSTS_BY_AUTHOR_QUERY, '', {
        authorId: userId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.postsByAuthor)).toBe(true);
      response.body.data.postsByAuthor.forEach((post: any) => {
        expect(post.author.id).toBe(userId);
      });
    });

    it('should apply limit to posts by author', async () => {
      const response = await gqlRequest(GET_POSTS_BY_AUTHOR_QUERY, '', {
        authorId: userId,
        limit: 1,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.postsByAuthor.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for author with no posts', async () => {
      const thirdUserResponse = await gqlRequest(REGISTER_MUTATION, '', {
        input: {
          username: 'thirduser',
          email: 'thirduser@example.com',
          password: 'TestPassword123!',
          confirmPassword: 'TestPassword123!',
        },
      });

      const thirdUserId = thirdUserResponse.body.data.signup.id;
      const response = await gqlRequest(GET_POSTS_BY_AUTHOR_QUERY, '', {
        authorId: thirdUserId,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.postsByAuthor).toEqual([]);
    });
  });

  describe('Get Posts by Category', () => {
    it('should get posts by specific category', async () => {
      const response = await gqlRequest(GET_POSTS_BY_CATEGORY_QUERY, '', {
        category: Category.TECHNOLOGY,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.postsByCategory)).toBe(true);
      response.body.data.postsByCategory.forEach((post: any) => {
        expect(post.category).toBe(Category.TECHNOLOGY);
      });
    });

    it('should apply limit to posts by category', async () => {
      const response = await gqlRequest(GET_POSTS_BY_CATEGORY_QUERY, '', {
        category: Category.TECHNOLOGY,
        limit: 1,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.postsByCategory.length).toBeLessThanOrEqual(1);
    });

    it('should test all category types', async () => {
      const categories = [
        Category.FASHION,
        Category.CUISINE,
        Category.TECHNOLOGY,
        Category.DIY,
        Category.LIFESTYLE,
        Category.TRAVEL,
        Category.CINEMA,
      ];

      for (const category of categories) {
        const response = await gqlRequest(GET_POSTS_BY_CATEGORY_QUERY, '', {
          category,
        });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(Array.isArray(response.body.data.postsByCategory)).toBe(true);
      }
    });
  });

  describe('Get Popular Posts', () => {
    it('should get popular posts', async () => {
      const response = await gqlRequest(GET_POPULAR_POSTS_QUERY);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.popularPosts)).toBe(true);
    });

    it('should apply limit to popular posts', async () => {
      const response = await gqlRequest(GET_POPULAR_POSTS_QUERY, '', {
        limit: 5,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.popularPosts.length).toBeLessThanOrEqual(5);
    });

    it('should include likeCount in popular posts', async () => {
      const response = await gqlRequest(GET_POPULAR_POSTS_QUERY);

      expect(response.status).toBe(200);
      response.body.data.popularPosts.forEach((post: any) => {
        expect(post.likeCount).toBeDefined();
        expect(typeof post.likeCount).toBe('number');
      });
    });
  });

  describe('Get Recent Posts', () => {
    it('should get recent posts', async () => {
      const response = await gqlRequest(GET_RECENT_POSTS_QUERY);
      console.log(util.inspect(response.body, { depth: null }));

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(Array.isArray(response.body.data.recentPosts)).toBe(true);
    });

    it('should apply limit to recent posts', async () => {
      const response = await gqlRequest(GET_RECENT_POSTS_QUERY, '', {
        limit: 5,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.recentPosts.length).toBeLessThanOrEqual(5);
    });

    it('should return posts in descending order by creation date', async () => {
      const response = await gqlRequest(GET_RECENT_POSTS_QUERY, '', {
        limit: 10,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      const posts = response.body.data.recentPosts;

      for (let i = 1; i < posts.length; i++) {
        const currentDate = new Date(posts[i].createdAt);
        const previousDate = new Date(posts[i - 1].createdAt);
        expect(currentDate.getTime()).toBeLessThanOrEqual(
          previousDate.getTime(),
        );
      }
    });
  });

  describe('Get Post Count', () => {
    it('should get total post count', async () => {
      const response = await gqlRequest(GET_POST_COUNT_QUERY);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(typeof response.body.data.postCount).toBe('number');
      expect(response.body.data.postCount).toBeGreaterThanOrEqual(2);
    });

    it('should get post count by category', async () => {
      const response = await gqlRequest(GET_POST_COUNT_QUERY, '', {
        category: Category.TECHNOLOGY,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(typeof response.body.data.postCount).toBe('number');
    });

    it('should get post count by author', async () => {
      const response = await gqlRequest(GET_POST_COUNT_QUERY, '', {
        authorId: userId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(typeof response.body.data.postCount).toBe('number');
    });

    it('should get post count by category and author', async () => {
      const response = await gqlRequest(GET_POST_COUNT_QUERY, '', {
        category: Category.TECHNOLOGY,
        authorId: userId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(typeof response.body.data.postCount).toBe('number');
    });
  });

  describe('Update Post', () => {
    it('should update own post with valid data', async () => {
      const updatedData = {
        id: createdPostId,
        title: 'Updated Post Title',
        desc: 'Updated description extended so as to remain valid hahahahaha',
      };

      const response = await gqlRequest(UPDATE_POST_MUTATION, authToken, {
        input: updatedData,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.updatePost).toMatchObject({
        id: createdPostId,
        title: updatedData.title,
        desc: updatedData.desc,
        content: validPostData.content,
      });
    });

    it('should update post category', async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, authToken, {
        input: {
          id: createdPostId,
          category: 'LIFESTYLE',
        },
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.updatePost.category).toBe(Category.LIFESTYLE);
    });

    it('should update post image', async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, authToken, {
        input: {
          id: createdPostId,
          image: 'https://example.com/new-image.jpg',
        },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.updatePost.image).toBe(
        'https://example.com/new-image.jpg',
      );
    });

    it('should fail to update post without authentication', async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, '', {
        input: {
          id: createdPostId,
          title: 'Should Fail',
        },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Invalid Authorization Header',
      );
    });

    it("should fail to update another user's post", async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, secondUserToken, {
        input: {
          id: createdPostId,
          title: 'Attempting to update another user post',
        },
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();

      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];

      expect(error.message).toBe(
        'You do not have permission to modify this Post',
      );
      expect(error.locations).toBeDefined();
      expect(error.path).toEqual(['updatePost']);

      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('FORBIDDEN');
      expect(error.extensions.statusCode).toBe(403);
      expect(error.extensions.details).toBe('Forbidden');

      expect(response.body.data).toBeNull();
    });

    it('should fail to update non-existent post', async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, authToken, {
        input: {
          id: 99999,
          title: 'Non-existent post',
        },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];

      expect(error.message).toMatch(/not found/i);
      expect(error.path).toEqual(['updatePost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('NOT_FOUND');
      expect(error.extensions.statusCode).toBe(404);
      expect(error.extensions.details).toMatch(/not found/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail with invalid title length on update', async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, authToken, {
        input: {
          id: createdPostId,
          title: 'ab',
        },
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];

      expect(error.message).toMatch(/title/i);
      expect(error.message).toMatch(/must be longer than or equal to/i);
      expect(error.path).toEqual(['updatePost']);

      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('BAD_REQUEST');
      expect(error.extensions.statusCode).toBe(400);
      expect(error.extensions.details).toMatch(/Bad Request/i);

      expect(response.body.data).toBeNull();
    });

    it('should fail with invalid category on update', async () => {
      const response = await gqlRequest(UPDATE_POST_MUTATION, authToken, {
        input: {
          id: createdPostId,
          category: 'INVALID_CATEGORY',
        },
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Delete Post', () => {
    let postToDelete: number;

    beforeAll(async () => {
      const response = await gqlRequest(CREATE_POST_MUTATION, authToken, {
        input: {
          title: 'Post to be deleted',
          content:
            "This post will be deleted in the test suite to verify deletion works properly. It shall be parsed, compiled, and run. or ran? which is it? i can't tell atp heathen.",
          image: 'https://example.com/delete-test.jpg',
          desc: 'Test description for deletion, sweetened with almond and baked with neon',
          category: Category.TECHNOLOGY,
        },
      });

      console.log(response.body);
      postToDelete = response.body.data.createPost.id;
    });

    it('should delete own post', async () => {
      const response = await gqlRequest(DELETE_POST_MUTATION, authToken, {
        id: postToDelete,
      });

      console.log(util.inspect(response.body, { depth: null }));
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.removePost).toMatchObject({
        id: postToDelete,
      });

      const getResponse = await gqlRequest(GET_POST_QUERY, '', {
        id: postToDelete,
      });
      expect(getResponse.body.errors).toBeDefined();
      expect(getResponse.body.errors[0].message).toContain('not found');
    });

    it('should fail to delete post without authentication', async () => {
      const response = await gqlRequest(DELETE_POST_MUTATION, '', {
        id: secondUserPostId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Invalid Authorization Header',
      );
    });

    it("should fail to delete another user's post", async () => {
      const response = await gqlRequest(DELETE_POST_MUTATION, authToken, {
        id: secondUserPostId,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];

      expect(error.message).toBe(
        'You do not have permission to modify this Post',
      );
      expect(error.locations).toBeDefined();
      expect(error.path).toEqual(['removePost']);

      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('FORBIDDEN');
      expect(error.extensions.statusCode).toBe(403);
      expect(error.extensions.details).toBe('Forbidden');

      expect(response.body.data).toBeNull();
    });

    it('should fail to delete non-existent post', async () => {
      const response = await gqlRequest(DELETE_POST_MUTATION, authToken, {
        id: 99999,
      });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];

      expect(error.message).toMatch(/not found/i);
      expect(error.path).toEqual(['removePost']);
      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toBe('NOT_FOUND');
      expect(error.extensions.statusCode).toBe(404);
      expect(error.extensions.details).toMatch(/not found/i);
      expect(response.body.data).toBeNull();
    });

    it('should fail to delete already deleted post', async () => {
      const response = await gqlRequest(DELETE_POST_MUTATION, authToken, {
        id: postToDelete,
      });

      console.log(util.inspect(response.body, { depth: null }));

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);

      const error = response.body.errors[0];

      expect(error.message).toMatch(
        /(already deleted|not found|does not exist)/i,
      );
      expect(error.path).toEqual(['removePost']);

      expect(error.extensions).toBeDefined();
      expect(error.extensions.code).toMatch(/NOT_FOUND|GONE/);
      expect(error.extensions.statusCode).toBeGreaterThanOrEqual(404);
      expect(error.extensions.details).toMatch(/deleted|not found/i);

      expect(response.body.data).toBeNull();
    });
  });

  describe('Field Resolvers', () => {
    it('should resolve likeCount field correctly', async () => {
      const response = await gqlRequest(GET_POST_QUERY, '', {
        id: createdPostId,
      });
      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.post.likeCount).toBeDefined();
      expect(typeof response.body.data.post.likeCount).toBe('number');
      expect(response.body.data.post.likeCount).toBeGreaterThanOrEqual(0);
    });
    it('should resolve commentCount field correctly', async () => {
      const response = await gqlRequest(GET_POST_QUERY, '', {
        id: createdPostId,
      });

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.post.commentCount).toBeDefined();
      expect(typeof response.body.data.post.commentCount).toBe('number');
      expect(response.body.data.post.commentCount).toBeGreaterThanOrEqual(0);
    });
  });
});
