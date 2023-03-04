import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PostsQueries } from '../graphql/posts.queries';
import { Category } from '../models/enum/category.enum';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private readonly apollo: Apollo,
  ) { }

  getPosts (cat?: Category) {
    return this.apollo.query({
      query: PostsQueries.GET_POSTS(cat),
      errorPolicy: "all"
    })
  }
}
