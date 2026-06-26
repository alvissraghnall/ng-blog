import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import {
  getUserAnalytics,
  getPostAnalytics,
  getTrendingTags,
  getPopularPosts,
} from '@graphql/queries';
import { NetworkError } from '@core/models/errors.model';
import { ResultOf } from '@graphql-typed-document-node/core';

export type UserAnalytics = ResultOf<typeof getUserAnalytics>['userAnalytics'];
export type PostAnalytics = ResultOf<typeof getPostAnalytics>['postAnalytics'];
export type TrendingTag = ResultOf<
  typeof getTrendingTags
>['trendingTags'][number];

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private readonly apollo: Apollo) {}

  getUserAnalytics(): Observable<UserAnalytics> {
    return this.apollo
      .query({
        query: getUserAnalytics,
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          if (result.error || !result.data?.userAnalytics) {
            throw new NetworkError('Unable to load analytics.');
          }
          return result.data.userAnalytics;
        }),
        catchError((error) => {
          const networkError = new NetworkError(
            error.message || 'Unable to load analytics. Please try again.',
          );
          return throwError(() => networkError);
        }),
      );
  }

  getPostAnalytics(postSlug: string): Observable<PostAnalytics> {
    return this.apollo
      .query({
        query: getPostAnalytics,
        variables: { slug: postSlug },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          if (result.error || !result.data?.postAnalytics) {
            throw new NetworkError('Unable to load post analytics.');
          }
          return result.data.postAnalytics;
        }),
        catchError((error) => {
          const networkError = new NetworkError(
            error.message || 'Unable to load post analytics. Please try again.',
          );
          return throwError(() => networkError);
        }),
      );
  }

  getTrendingTags(
    limit = 10,
    timeRange: 'day' | 'week' | 'month' = 'week',
  ): Observable<TrendingTag[]> {
    return this.apollo
      .query({
        query: getTrendingTags,
        variables: { limit, timeRange },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          if (result.error || !result.data?.trendingTags) {
            throw new NetworkError('Unable to load trending tags.');
          }
          return result.data.trendingTags;
        }),
        catchError((error) => {
          const networkError = new NetworkError(
            error.message || 'Unable to load trending tags. Please try again.',
          );
          return throwError(() => networkError);
        }),
      );
  }

  /**
   * Get popular posts
   * @throws {NetworkError} When request fails
   */
  getPopularPosts(
    limit = 10,
    timeRange: 'day' | 'week' | 'month' | 'all' = 'week',
  ): Observable<any[]> {
    return this.apollo
      .query({
        query: getPopularPosts,
        variables: { limit },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          if (result.error || !result.data?.popularPosts) {
            throw new NetworkError('Unable to load popular posts.');
          }
          return result.data.popularPosts;
        }),
        catchError((error) => {
          const networkError = new NetworkError(
            error.message || 'Unable to load popular posts. Please try again.',
          );
          return throwError(() => networkError);
        }),
      );
  }

  trackView(slug: string) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation trackView($slug: String!) {
            trackPostView(slug: $slug)
          }
        `,
        variables: { slug },
      })
      .subscribe();
  }

  trackPageView(pagePath: string, pageTitle?: string): void {
    // integrate with Google analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  }

  trackEvent(eventName: string, eventParams?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  }

  trackPostEngagement(
    action: 'view' | 'like' | 'comment' | 'share',
    postSlug: string,
  ): void {
    this.trackEvent('post_engagement', {
      action,
      post_slug: postSlug,
    });
  }

  trackUserInteraction(
    action: 'follow' | 'unfollow' | 'profile_view',
    username: string,
  ): void {
    this.trackEvent('user_interaction', {
      action,
      username,
    });
  }
}
