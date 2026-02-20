import { Component, DestroyRef, inject, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { UserService } from '../../../core/auth/services/user.service';
import { User } from '@/gql-types';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-follow-button',
  template: `
    <button
      class="btn btn-sm action-btn"
      [ngClass]="{
        disabled: isSubmitting,
        'btn-outline-secondary': !profile.isFollowing,
        'btn-secondary': profile.isFollowing,
      }"
      (click)="toggleFollowing()"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ profile.isFollowing ? 'Unfollow' : 'Follow' }} {{ profile.username }}
    </button>
  `,
  imports: [NgClass],
})
export class FollowButtonComponent {
  @Input() profile!: User;
  @Output() toggle = new EventEmitter<User>();
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

//   constructor(
//     private readonly profileService: ProfileService,
//     private readonly router: Router,
//     private readonly userService: UserService,
//   ) {}

//   toggleFollowing(): void {
//     this.isSubmitting = true;

    this.userService.isAuthenticated
      .pipe(
        switchMap((isAuthenticated: boolean) => {
          if (!isAuthenticated) {
            void this.router.navigate(['/login']);
            return EMPTY;
          }
          return this.profileService.toggleFollow(this.profile);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: profile => {
          this.isSubmitting = false;
          this.profile = profile;
          this.toggle.emit(profile);
        },
        error: () => (this.isSubmitting = false),
      });
  }
}
