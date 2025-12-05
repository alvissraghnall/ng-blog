import { Tag } from '@/gql-types';
import { Injectable } from '@angular/core';
import { getTags } from '@graphql/queries';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(private readonly apollo: Apollo) {}

  getAll(): Observable<Omit<Tag, 'createdAt' | 'updatedAt'>[]> {
    return this.apollo
      .query({
        query: getTags,
        fetchPolicy: 'cache-first',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.tags) {
            throw new Error('Fetching tags failed.');
          }
          return result.data.tags;
        }),
        catchError(error => {
          const _error = new Error(error.message || 'Unable to fetch tags.');
          return throwError(() => _error);
        }),
      );
  }
}
