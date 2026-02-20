import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { User } from '@/gql-types';
import { PostListConfig } from '../../post/services/posts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GraphQLOmitType } from '@utils/graphql-omit-type';

type ProfileUser = GraphQLOmitType<User, 'createdAt'>;

@Component({
  selector: 'app-profile-favorites',
  template: `<div></div>`,
  imports: [],
})
export default class ProfileFavoritesComponent implements OnInit {
  profile!: ProfileUser;
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
          this.profile = profile;
          this.favoritesConfig = {
            type: 'all',
            filters: {},
          };
        },
      });
  }
}
