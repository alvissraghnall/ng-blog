import { Component, Input } from '@angular/core';
import { Post } from '@/gql-types';
import { ArticleMetaComponent } from './article-meta.component';
import { RouterLink } from '@angular/router';
import { FavoriteButtonComponent } from './favorite-button.component';

@Component({
  selector: 'app-article-preview',
  template: `
    <div class="article-preview">
      <app-article-meta [post]="post">
        <app-favorite-button [post]="post" (toggle)="toggleFavorite($event)" class="pull-xs-right">
          {{ post.likeCount }}
        </app-favorite-button>
      </app-article-meta>

      <a [routerLink]="['/article', post.slug]" class="preview-link">
        <h1>{{ post.title }}</h1>
        <p>{{ post.desc }}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          @for (tag of post.tags; track tag.id) {
            <li class="tag-default tag-pill tag-outline">
              {{ tag.name }}
            </li>
          }
        </ul>
      </a>
    </div>
  `,
  imports: [ArticleMetaComponent, FavoriteButtonComponent, RouterLink],
})
export class ArticlePreviewComponent {
  @Input() post!: Post;

  toggleFavorite(liked: boolean): void {
    if (liked) {
      this.post.likeCount++;
    } else {
      this.post.likeCount--;
    }
  }
}
