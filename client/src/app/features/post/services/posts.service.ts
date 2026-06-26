import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { createPost, updatePost, toggleLike, removePost } from '@graphql/mutations';
import { getPost, getAllPosts, getPostsByAuthor, getRecentPosts, getPostsByCategory } from '@graphql/queries';

import { ValidationError, NetworkError, AuthenticationError } from '@core/models/errors.model';
import { CreateLikeInput, CreatePostInput, UpdatePostInput, EntityOwnsLike, Post, Category } from '@/gql-types';

export interface PostListConfig {
  type?: 'all' | 'feed' | 'user' | 'category';
  filters: {
    category?: Category;
    authorId?: string;
    limit?: number;
    offset?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private readonly apollo: Apollo) {}

  query(config: PostListConfig): Observable<{ posts: Post[]; postsCount: number }> {
    const queryMap = {
      all: getAllPosts,
      feed: getRecentPosts,
      user: getPostsByAuthor,
      category: getPostsByCategory,
    };

    const queryDocument = queryMap[config.type || 'all'];

    return this.apollo
      .query({
        query: queryDocument,
        variables: {
          ...config.filters,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data) {
            throw new NetworkError('Unable to load posts.');
          }
          const data = result.data as any;
          // Find the array key dynamically (posts, feedPosts, etc)
          const key = Object.keys(data).find(k => k.toLowerCase().includes('post'));
          const posts = data[key!] || [];

          return { posts, postsCount: posts.length };
        }),
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  get(slug: string): Observable<Post> {
    return this.apollo
      .query({
        query: getPost,
        variables: { slug, id: null },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.post) {
            throw new NetworkError('Post not found.');
          }
          return result.data.post as Post;
        }),
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  create(postInput: CreatePostInput): Observable<Post> {
    return this.apollo
      .mutate({
        mutation: createPost,
        variables: { createPostInput: postInput },
      })
      .pipe(
        map(result => result.data?.createPost as Post),
        catchError(this.handleAuthErrors),
      );
  }

  update(id: number, postInput: UpdatePostInput): Observable<Post> {
    const inputWithId = { ...postInput, id };
    return this.apollo
      .mutate({
        mutation: updatePost,
        variables: { updatePostInput: inputWithId },
      })
      .pipe(
        map(result => result.data?.updatePost as Post),
        catchError(this.handleAuthErrors),
      );
  }

  delete(id: number): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: removePost,
        variables: { id },
      })
      .pipe(
        map(result => !!result.data?.removePost),
        catchError(this.handleAuthErrors),
      );
  }

  toggleLike(post: Post): Observable<boolean> {
    const input: CreateLikeInput = {
      postId: post.id,
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
