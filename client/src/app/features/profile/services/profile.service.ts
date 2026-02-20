import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { User as Profile } from '@/gql-types';
import { followUser, unfollowUser } from '@graphql/mutations';
import { getProfile, getFollowers, getFollowing } from '@graphql/queries';
import { NetworkError, AuthenticationError } from '@core/models/errors.model';
import { GraphQLOmitType } from '@utils/graphql-omit-type';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private readonly apollo: Apollo) {}

  get(username: string): Observable<GraphQLOmitType<Profile, 'createdAt'>> {
    return this.apollo
      .query({
        query: getProfile,
        variables: { username },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data) throw new NetworkError('Profile not found');
          return result.data.user;
        }),
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  follow(id: string): Observable<Profile> {
    return this.apollo
      .mutate({
        mutation: followUser,
        variables: { userToBeFollowedId: id },
      })
      .pipe(
        map(result => {
          if (!result.data?.followUser) throw new NetworkError('Failed to follow');
          return result.data.followUser as Profile;
        }),
        catchError(this.handleAuthErrors),
      );
  }

  unfollow(id: string): Observable<Profile> {
    return this.apollo
      .mutate({
        mutation: unfollowUser,
        variables: { userToBeUnfollowedId: id },
      })
      .pipe(
        map(result => {
          if (!result.data?.unFollowUser) throw new NetworkError('Failed to unfollow');
          return result.data.unFollowUser as Profile;
        }),
        catchError(this.handleAuthErrors),
      );
  }

  toggleFollow(profile: Profile): Observable<Profile> {
    const isFollowing = profile.isFollowing;

    return isFollowing ? this.unfollow(profile.id) : this.follow(profile.id);
  }

  getFollowers(username: string, limit = 20, offset = 0): Observable<Profile[]> {
    return this.apollo
      .query({
        query: getFollowers,
        variables: { username, limit, offset },
      })
      .pipe(
        map(result => (result.data as any).followers || []),
        catchError(this.handleError),
      );
  }

  getFollowing(username: string, limit = 20, offset = 0): Observable<Profile[]> {
    return this.apollo
      .query({
        query: getFollowing,
        variables: { username, limit, offset },
      })
      .pipe(
        map(result => (result.data as any).following || []),
        catchError(this.handleError),
      );
  }

  private handleError(error: any) {
    return throwError(() => new NetworkError(error.message || 'Request failed'));
  }

  private handleAuthErrors(error: any) {
    if (error.message?.includes('authentication')) {
      return throwError(() => new AuthenticationError('Action unauthorized.'));
    }
    return throwError(() => new NetworkError(error.message));
  }
}
