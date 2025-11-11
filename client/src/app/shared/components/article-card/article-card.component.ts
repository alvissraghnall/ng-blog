import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article-card',
  imports: [],
  template: `
    <div class="flex flex-col gap-3 group">
      <div
        class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
        [style.background-image]="'url(' + article.imageUrl + ')'"
        [attr.data-alt]="article.imageAlt"
      ></div>
      <div>
        <h3
          class="text-text-light dark:text-text-dark text-xl font-display font-bold leading-snug mb-1 group-hover:text-primary-custom transition-colors"
        >
          {{ article.title }}
        </h3>
        <p class="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal mb-2">
          {{ article.description }}
        </p>
        <p class="text-text-muted-light/70 dark:text-text-muted-dark/70 text-xs font-normal leading-normal">
          {{ article.author }} - {{ article.date }}
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class ArticleCardComponent {
  @Input({ required: true }) article!: Article;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}
