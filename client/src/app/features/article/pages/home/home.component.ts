import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagsService } from '../../../post/services/tags.service';
import { PostListConfig } from '../../../post/services/posts.service';
import { tap } from 'rxjs/operators';
import { UserService } from '@core/auth/services/user.service';
import { RxLet } from '@rx-angular/template/let';
import { IfAuthenticatedDirective } from '@core/auth/if-authenticated.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CallToActionComponent } from '@components/call-to-action/call-to-action.component';
import { HeroSectionComponent } from '@components/hero-section/hero-section.component';
import { LatestPostsComponent } from '@components/latest-posts/latest-posts.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RxLet,
    IfAuthenticatedDirective,
    CallToActionComponent,
    HeroSectionComponent,
    LatestPostsComponent,
  ],
})
export default class HomeComponent implements OnInit {
  isAuthenticated = false;
  listConfig: PostListConfig = {
    type: 'all',
    filters: {},
  };
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated
      .pipe(
        tap(isAuthenticated => {
          if (isAuthenticated) {
            this.setListTo('feed');
          } else {
            this.setListTo('all');
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated));
  }

  setListTo(type: string = '', filters: Object = {}): void {
    if (type === 'feed' && !this.isAuthenticated) {
      void this.router.navigate(['/login']);
      return;
    }

    this.listConfig = { type: type as PostListConfig['type'], filters };
  }
}
