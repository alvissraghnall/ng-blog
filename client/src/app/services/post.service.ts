import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PostsQueries } from '../graphql/posts.queries';
import { Category } from '../models/enum/category.enum';
import { CreatePostInput } from '../models/inputs/create-post.input';
import { Post } from '../models/Post.model';
import { KeyStorageService } from './key-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  UPLOAD_URI = 'http://[::1]:3000/api/v1/cloudinary/upload';

  constructor(
    private readonly apollo: Apollo,
    private readonly http: HttpClient,
    private readonly keyStorageService: KeyStorageService
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

  createPost (post: CreatePostInput) {
    return this.apollo.mutate({
      mutation: PostsQueries.CREATE_POST(),
      variables: {
        input: post
      },
      errorPolicy: 'all'
    })
  }

  uploadPostImage (fd: FormData) {
    const token = this.keyStorageService.getToken();
    return this.http.post<FormData>(
      this.UPLOAD_URI, fd, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
  }

}

