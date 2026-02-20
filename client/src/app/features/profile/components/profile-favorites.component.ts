import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleListComponent } from '../../article/components/article-list.component';
import { ProfileService } from '../services/profile.service';
import { User } from '@/gql-types';
import { PostListConfig } from '../../post/services/posts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-favorites',
  template: `<app-article-list [limit]="10" [config]="favoritesConfig" />`,
  imports: [ArticleListComponent],
})
export default class ProfileFavoritesComponent implements OnInit {
  profile!: User;
  favoritesConfig!: PostListConfig;
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.parent?.snapshot.params['username'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profile = profile as User;
          this.favoritesConfig = {
            type: 'all',
            filters: {},
          };
        },
      });
  }
}
