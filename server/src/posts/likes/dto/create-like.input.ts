import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { CommentOrPost } from '../validator/comment-or-post.validator';

@InputType()
export class CreateLikeInput {
  
  @Field(() => Int, { description: "Comment with like", nullable: true })
  @CommentOrPost(CreateLikeInput, cli => cli.postId, { message: "Comment or post must be provided, but not both." })
  commentId?: number;

  @Field(() => Int, { description: "Post with like", nullable: true })
  postId?: number;

}
