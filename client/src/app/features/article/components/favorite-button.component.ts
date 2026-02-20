import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
import { NgClass } from '@angular/common';
import { PostsService } from '../../post/services/posts.service';
import { UserService } from '../../../core/auth/services/user.service';
import { Post } from '@/gql-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-favorite-button',
  template: `
    <button
      class="btn btn-sm"
      [ngClass]="{
        disabled: isSubmitting,
        'btn-outline-primary': !isLiked,
        'btn-primary': isLiked,
      }"
      (click)="toggleFavorite()"
    >
      <i class="ion-heart"></i> <ng-content></ng-content>
    </button>
  `,
  imports: [NgClass],
})
export class FavoriteButtonComponent {
  destroyRef = inject(DestroyRef);
  isSubmitting = false;
  isLiked = false;

  @Input() post!: Post;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly postsService: PostsService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  toggleFavorite(): void {
    this.isSubmitting = true;

    this.userService.isAuthenticated
      .pipe(
        switchMap(authenticated => {
          if (!authenticated) {
            void this.router.navigate(['/register']);
            return EMPTY;
          }
          return this.postsService.toggleLike(this.post);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (liked) => {
          this.isSubmitting = false;
          this.isLiked = liked;
          this.toggle.emit(liked);
        },
        error: () => (this.isSubmitting = false),
      });
  }
}
