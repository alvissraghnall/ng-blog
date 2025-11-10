import { Component, Input } from '@angular/core';
import { ZardAvatarComponent } from '@ui/avatar/avatar.component';

@Component({
  selector: 'app-author-bio',
  imports: [ZardAvatarComponent],
  template: `
    <div
      class="mt-12 p-6 rounded-lg bg-background-light dark:bg-background-dark flex flex-col sm:flex-row items-start gap-6"
    >
      <z-avatar
        [zImage]="{
          url: author.avatar,
          alt: author.username + ALT_TEXT,
          fallback: 'AA',
        }"
        class="w-20 h-20 rounded-full flex-shrink-0"
      />
      <div class="flex flex-col gap-2">
        <p class="text-xs font-bold uppercase tracking-wider text-muted-light dark:text-gray-400">Written By</p>
        <h3 class="text-xl font-bold text-neutral-light dark:text-neutral-dark">{{ author.username }}</h3>
        <p class="text-base text-muted-light dark:text-gray-300">{{ author.bio }}</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class AuthorBioComponent {
  protected ALT_TEXT = "'s profile avatar'";
  @Input({ required: true }) author!: Author;
}

interface Author {
  username: string;
  avatar: string;
  bio: string;
}
