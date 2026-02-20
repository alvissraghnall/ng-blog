import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '@/gql-types';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-article-meta',
  template: `
    <div class="article-meta">
      <a [routerLink]="['/profile', post.author.username]">
        <img [src]="post.author.avatar || 'assets/images/default-avatar.png'" />
      </a>

      <div class="info">
        <a class="author" [routerLink]="['/profile', post.author.username]">
          {{ post.author.username }}
        </a>
        <span class="date">
          {{ post.createdAt | date: 'longDate' }}
        </span>
      </div>

      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
})
export class ArticleMetaComponent {
  @Input() post!: Post;
}
