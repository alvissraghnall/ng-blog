import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { combineLatest, of, throwError } from 'rxjs';
import { UserService } from '@core/auth/services/user.service';
import { ProfileService } from '../../services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FollowButtonComponent } from '../../components/follow-button.component';
import { ZardButtonComponent } from '@ui/button/button.component';
import { User } from '@/gql-types';
import { GraphQLOmitType } from '@utils/graphql-omit-type';

interface Tab {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  imports: [FollowButtonComponent, RouterLink, RouterOutlet, ZardButtonComponent],
})
export class ProfileComponent implements OnInit {
  profile!: GraphQLOmitType<User, 'createdAt'>;
  isUser: boolean = false;
  isLoading = true;
  destroyRef = inject(DestroyRef);

  tabs: Tab[] = [
    { id: 'posts', label: 'Posts', active: true },
    { id: 'favorites', label: 'Favorites', active: false },
  ];

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
          this.isLoading = false;
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
        this.isLoading = false;
      });
  }

  selectTab(tabId: string): void {
    this.tabs = this.tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId,
    }));
  }

  onToggleFollowing(profile: GraphQLOmitType<User, 'createdAt'>) {
    this.profile = profile;
  }
}
