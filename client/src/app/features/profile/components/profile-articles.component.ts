import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleListComponent } from '../../article/components/article-list.component';
import { ProfileService } from '../services/profile.service';
import { User } from '@/gql-types';
import { PostListConfig } from '../../post/services/posts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GraphQLOmitType } from '@utils/graphql-omit-type';

@Component({
  selector: 'app-profile-articles',
  template: `<app-article-list [limit]="10" [config]="articlesConfig" />`,
  imports: [ArticleListComponent],
})
export default class ProfileArticlesComponent implements OnInit {
  profile!: GraphQLOmitType<User, "createdAt" | "isFollowing">;
  articlesConfig!: PostListConfig;
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.profileService
      .get(this.route.snapshot.params['username'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.articlesConfig = {
            type: 'user',
            filters: {
              authorId: this.profile.id,
            },
          };
        },
      });
  }
}
