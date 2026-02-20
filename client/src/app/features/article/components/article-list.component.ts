import { Component, DestroyRef, inject, Input } from '@angular/core';
import { PostsService, PostListConfig } from '../../post/services/posts.service';
import { Post } from '@/gql-types';
import { ArticlePreviewComponent } from './article-preview.component';
import { NgClass } from '@angular/common';
import { LoadingState } from '../../../core/models/loading-state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-article-list',
  template: `
    @if (loading === LoadingState.LOADING) {
      <div class="article-preview">Loading articles...</div>
    }

    @if (loading === LoadingState.LOADED) {
      @for (post of results; track post.id) {
        <app-article-preview [post]="post" />
      } @empty {
        <div class="article-preview">No articles are here... yet.</div>
      }

      <nav>
        <ul class="pagination">
          @for (pageNumber of totalPages; track pageNumber) {
            <li class="page-item" [ngClass]="{ active: pageNumber === currentPage }">
              <button class="page-link" (click)="setPageTo(pageNumber)">
                {{ pageNumber }}
              </button>
            </li>
          }
        </ul>
      </nav>
    }
  `,
  imports: [ArticlePreviewComponent, NgClass],
  styles: `
    .page-link {
      cursor: pointer;
    }
  `,
})
export class ArticleListComponent {
  query!: PostListConfig;
  results: Post[] = [];
  currentPage = 1;
  totalPages: Array<number> = [];
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroyRef = inject(DestroyRef);

  @Input() limit = 10;
  @Input()
  set config(config: PostListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  constructor(private postsService: PostsService) {}

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = LoadingState.LOADING;
    this.results = [];

    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset = this.limit * (this.currentPage - 1);
    }

    this.postsService
      .query(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.loading = LoadingState.LOADED;
        this.results = data.posts;

        this.totalPages = Array.from(new Array(Math.ceil(data.postsCount / this.limit)), (val, index) => index + 1);
      });
  }
}
