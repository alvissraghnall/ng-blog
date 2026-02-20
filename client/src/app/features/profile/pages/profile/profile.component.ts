import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { combineLatest, of, throwError } from 'rxjs';
import { UserService } from '@core/auth/services/user.service';
import { ProfileService } from '../../services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FollowButtonComponent } from '../../components/follow-button.component';
import { User } from '@/gql-types';
import { GraphQLOmitType } from '@utils/graphql-omit-type';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class ProfileComponent implements OnInit {
  profile!: GraphQLOmitType<User, "createdAt" | "isFollowing">;
  isUser: boolean = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.snapshot.params['username'])
      .pipe(
        catchError(error => {
          void this.router.navigate(['/']);
          return throwError(() => error);
        }),
        switchMap(profile => {
          return combineLatest([of(profile), this.userService.currentUser]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([profile, user]) => {
        this.profile = profile;
        this.isUser = profile.username === user?.username;
      });
  }

  onToggleFollowing(profile: User) {
    this.profile = profile;
  }
}
