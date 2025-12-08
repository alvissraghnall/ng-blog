import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Post, User, Tag } from '@/gql-types';
import { searchPosts, searchUsers, searchTags } from '@graphql/queries';
import { NetworkError } from '@core/models/errors.model';
import { ResultOf } from '@graphql-typed-document-node/core';

export interface SearchResults {
  posts: ResultOf<typeof searchPosts>['searchPosts'];
  users: ResultOf<typeof searchUsers>['searchUsers'];
  tags: ResultOf<typeof searchTags>['searchTags'];
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchQuerySubject = new Subject<string>();
  private searchResultsSubject = new BehaviorSubject<SearchResults>({
    posts: [],
    users: [],
    tags: [],
  });

  public searchResults$ = this.searchResultsSubject.asObservable();
  private readonly DEBOUNCE_TIME = 300;

  constructor(private readonly apollo: Apollo) {
    this.setupSearchStream();
  }

  private setupSearchStream(): void {
    this.searchQuerySubject
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.trim().length < 2) {
            // empty results observable if query too short
            return of({ posts: [], users: [], tags: [] });
          }
          return this.searchAll(query);
        }),
      )
      .subscribe({
        next: results => this.searchResultsSubject.next(results),
        error: error => console.error('Search error:', error),
      });
  }

  search(query: string): void {
    this.searchQuerySubject.next(query);
  }

  searchAll(query: string, limit = 5): Observable<SearchResults> {
    const trimmedQuery = query.trim();

    const posts$ = this.apollo
      .query({
        query: searchPosts,
        variables: { query: trimmedQuery, limit, offset: 0 },
        fetchPolicy: 'network-only',
      })
      .pipe(map(r => r.data?.searchPosts || []));

    const users$ = this.apollo
      .query({
        query: searchUsers,
        variables: { query: trimmedQuery, limit, offset: 0 },
        fetchPolicy: 'network-only',
      })
      .pipe(map(r => r.data?.searchUsers || []));

    const tags$ = this.apollo
      .query({
        query: searchTags,
        variables: { query: trimmedQuery, limit },
        fetchPolicy: 'network-only',
      })
      .pipe(map(r => r.data?.searchTags || []));

    return forkJoin({
      posts: posts$,
      users: users$,
      tags: tags$,
    }).pipe(
      catchError(error => {
        return throwError(() => new NetworkError('Search failed.'));
      }),
    );
  }

  searchPosts(query: string, limit = 20, offset = 0): Observable<SearchResults['posts']> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return throwError(() => new NetworkError('Search query must be at least 2 characters.'));
    }

    return this.apollo
      .query({
        query: searchPosts,
        variables: { query: trimmedQuery, limit, offset },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.searchPosts) {
            throw new NetworkError('Unable to search posts.');
          }
          return result.data.searchPosts;
        }),
        catchError(error => {
          const networkError = new NetworkError(error.message || 'Unable to search posts. Please try again.');
          return throwError(() => networkError);
        }),
      );
  }

  searchUsers(query: string, limit = 20, offset = 0): Observable<SearchResults['users']> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return throwError(() => new NetworkError('Search query must be at least 2 characters.'));
    }

    return this.apollo
      .query({
        query: searchUsers,
        variables: { query: trimmedQuery, limit, offset },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.searchUsers) {
            throw new NetworkError('Unable to search users.');
          }
          return result.data.searchUsers;
        }),
        catchError(error => {
          const networkError = new NetworkError(error.message || 'Unable to search users. Please try again.');
          return throwError(() => networkError);
        }),
      );
  }

  searchTags(query: string, limit = 20): Observable<SearchResults['tags']> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return throwError(() => new NetworkError('Search query must be at least 2 characters.'));
    }

    return this.apollo
      .query({
        query: searchTags,
        variables: { query: trimmedQuery, limit },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.searchTags) {
            throw new NetworkError('Unable to search tags.');
          }
          return result.data.searchTags;
        }),
        catchError(error => {
          const networkError = new NetworkError(error.message || 'Unable to search tags. Please try again.');
          return throwError(() => networkError);
        }),
      );
  }

  clearResults(): void {
    this.searchResultsSubject.next({
      posts: [],
      users: [],
      tags: [],
    });
  }

  /**
   * Get current search results synchronously
   */
  getCurrentResults(): SearchResults {
    return this.searchResultsSubject.value;
  }
}
