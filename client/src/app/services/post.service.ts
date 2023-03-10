import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PostsQueries } from '../graphql/posts.queries';
import { Category } from '../models/enum/category.enum';
import { Post } from '../models/Post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private readonly apollo: Apollo,
  ) { }

  getPosts (cat?: Category, authorId?: string) {
    return this.apollo.query({
      query: PostsQueries.GET_POSTS(cat, authorId),
      errorPolicy: "all"
    })
  }

  getPost (idx: number) {
    return this.apollo.query({
      query: PostsQueries.GET_POST(idx),
      errorPolicy: "all"
    });
    // this.apollo.
  }

}
