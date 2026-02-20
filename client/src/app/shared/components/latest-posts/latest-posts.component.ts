import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { PostsService } from '../../../features/post/services/posts.service';
import { Post } from '@/gql-types';

@Component({
  selector: 'app-latest-posts',
  imports: [RouterLink, DatePipe],
  template: `
    <section class="bg-background py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center pb-12 md:pb-16">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-text-light dark:text-text-dark">
            Latest Articles
          </h2>
        </div>

        @if (isLoading) {
          <div class="text-center text-muted-foreground">Loading articles...</div>
        } @else {
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            @for (post of posts; track post.id) {
              <a [routerLink]="['/article', post.slug]" class="flex flex-col gap-3 group cursor-pointer">
                <div
                  class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
                  [style.background-image]="'url(' + (post.image || 'assets/images/default-post.png') + ')'"
                ></div>
                <div>
                  <h3
                    class="text-text-light dark:text-text-dark text-xl font-display font-bold leading-snug mb-1 group-hover:text-primary-custom transition-colors"
                  >
                    {{ post.title }}
                  </h3>
                  <p class="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal mb-2 cursor-text">
                    {{ post.desc }}
                  </p>
                  <p class="text-text-muted-light/70 dark:text-text-muted-dark/70 text-xs font-normal leading-normal">
                    {{ post.author.username }} - {{ post.createdAt | date: 'mediumDate' }}
                  </p>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: ``,
})
export class LatestPostsComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;
  private destroyRef = inject(DestroyRef);

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.query({ type: 'all', filters: { limit: 6 } })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.posts = result.posts;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
