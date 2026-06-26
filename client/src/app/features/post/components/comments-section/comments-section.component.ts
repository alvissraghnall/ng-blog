import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardAvatarComponent } from '@ui/avatar/avatar.component';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';

@Component({
  selector: 'app-comments-section',
  imports: [RouterLink, ZardInputDirective, ZardButtonComponent, ZardAvatarComponent],
  template: `
    <section class="mt-16">
      <h2 class="text-2xl font-bold text-neutral-light dark:text-neutral-dark mb-6">
        Join the Discussion ({{ comments.length }})
      </h2>

      <div class="mb-8">
        <textarea z-input placeholder="Write your comment here..." rows="4" class="w-full"></textarea>
        <z-button class="mt-4">Submit Comment</z-button>
      </div>

      <div class="space-y-8">
        @for (comment of comments; track comment.id) {
          <div class="flex items-start gap-4">
            <a [routerLink]="['/profile', comment.author.username]" class="cursor-pointer shrink-0">
              <z-avatar
                [zImage]="{
                  url: comment.author.avatar,
                  alt: comment.author.username + ALT_TEXT,
                  fallback: 'AA',
                }"
                class="w-10 h-10"
              />
            </a>
            <div class="flex-1">
              <div class="flex items-baseline gap-2">
                <a [routerLink]="['/profile', comment.author.username]" class="cursor-pointer font-semibold text-neutral-light dark:text-neutral-dark hover:text-primary-custom transition-colors">
                  {{ comment.author.username }}
                </a>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ comment.date }}</p>
              </div>
              <p class="mt-1 text-gray-700 dark:text-gray-300">{{ comment.text }}</p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: ``,
})
export class CommentsSectionComponent {
  protected ALT_TEXT = "'s profile avatar'";

  comments: Comment[] = [
    {
      id: 1,
      author: {
        username: 'Sarah Miller',
        avatar: 'https://picsum.photos/id/911/80/80',
      },
      date: '2 days ago',
      text: 'Great article! The point about white space is so often overlooked. It really does make a huge difference in user experience.',
    },
    {
      id: 2,
      author: {
        username: 'Ben Carter',
        avatar: 'https://picsum.photos/id/577/80/80',
      },
      date: '1 day ago',
      text: "Loved the Saint-Exupéry quote. It's a perfect summary of the minimalist philosophy. I'm trying to apply this more in my own work.",
    },
    {
      id: 3,
      author: {
        username: 'Chloe Davis',
        avatar: 'https://picsum.photos/id/208/80/80',
      },
      date: '5 hours ago',
      text: "This is exactly what I needed to read. I've been struggling with a cluttered design, and these principles give me a clear path forward. Thank you!",
    },
  ];

  onCommentSubmit(commentText: string) {
    console.log('New comment:', commentText);
  }
}
interface CommentAuthor {
  username: string;
  avatar: string;
}
interface Comment {
  id: number;
  author: CommentAuthor;
  date: string;
  text: string;
}
