import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { createComment, updateComment, removeComment, toggleLike } from '@graphql/mutations';
import { getComments, getComment } from '@graphql/queries';
import { ValidationError, NetworkError, AuthenticationError } from '@core/models/errors.model';
import { Comment, CreateCommentInput, UpdateCommentInput, CreateLikeInput, EntityOwnsLike } from '@/gql-types';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private readonly apollo: Apollo) {}

  getAll(postId: number, limit = 20, offset = 0): Observable<Comment[]> {
    return this.apollo
      .watchQuery({
        query: getComments,
        variables: { postId, limit, offset },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(
        map(result => {
          if (result.error || !result.data) {
            throw new NetworkError('Unable to load comments.');
          }

          const data = result.data as any;
          return data.comments || [];
        }),
        catchError(error => {
          return throwError(() => new NetworkError(error.message || 'Load failed'));
        }),
        shareReplay(1),
      );
  }

  get(id: number): Observable<Comment> {
    return this.apollo
      .query({
        query: getComment,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data) {
            throw new NetworkError('Comment not found.');
          }
          return (result.data as any).comment;
        }),
        catchError(this.handleError),
      );
  }

  create(postId: number, text: string): Observable<Comment> {
    const input: CreateCommentInput = {
      postId,

      text,
    };

    return this.apollo
      .mutate({
        mutation: createComment,
        variables: { createCommentInput: input },

        refetchQueries: [{ query: getComments, variables: { postId } }],
      })
      .pipe(
        map(result => {
          if (!result.data?.createComment) {
            throw new ValidationError('Unable to post comment.');
          }
          return result.data.createComment as Comment;
        }),
        catchError(this.handleAuthErrors),
      );
  }

  update(id: number, text: string): Observable<Comment> {
    const input: UpdateCommentInput = {
      id,

      text,
    };

    return this.apollo
      .mutate({
        mutation: updateComment,
        variables: { updateCommentInput: input },
      })
      .pipe(
        map(result => {
          if (!result.data?.updateComment) {
            throw new ValidationError('Unable to update comment.');
          }
          return result.data.updateComment as Comment;
        }),
        catchError(this.handleAuthErrors),
      );
  }

  delete(id: number): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: removeComment,

        variables: { id },

        update: cache => {
          cache.evict({ id: `Comment:${id}` });
          cache.gc();
        },
      })
      .pipe(
        map(result => !!result.data?.removeComment),
        catchError(this.handleAuthErrors),
      );
  }

  toggleLike(comment: Comment): Observable<boolean> {
    const input: CreateLikeInput = {
      commentId: comment.id,
    };

    return this.apollo
      .mutate({
        mutation: toggleLike,
        variables: { createLikeInput: input },
      })
      .pipe(
        map(result => !!result.data?.toggleLike),
        catchError(this.handleAuthErrors),
      );
  }

  private handleError(error: any) {
    return throwError(() => new NetworkError(error.message || 'Request failed'));
  }

  private handleAuthErrors(error: any) {
    if (error.message?.includes('authentication')) {
      return throwError(() => new AuthenticationError('Action unauthorized.'));
    }
    return throwError(() => new ValidationError(error.message));
  }
}
