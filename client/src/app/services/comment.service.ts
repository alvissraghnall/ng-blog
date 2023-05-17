import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_COMMENT, LIKE_COMMENT } from '../graphql/comments.queries';
import { CreateCommentInput } from '@models/inputs/create-comment.input';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private readonly apollo: Apollo,
  ) { }

  createComment (createCommentInput: CreateCommentInput) {
    return this.apollo.mutate({
      mutation: CREATE_COMMENT,
      errorPolicy: 'all',
      variables: {
        input: createCommentInput
      }
    })
  }

  likeComment (id: number) {
    return this.apollo.mutate({
      mutation: LIKE_COMMENT,
      errorPolicy: 'all',
      variables: {
        commentId: id
      }
    })
  }
}
