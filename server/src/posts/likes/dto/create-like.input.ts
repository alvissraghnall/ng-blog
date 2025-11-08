import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, ValidateIf, IsOptional } from 'class-validator';
import { CommentOrPost } from '../validator/comment-or-post.validator';

@InputType()
export class CreateLikeInput {
  @Field(() => Int, { description: 'Comment with like', nullable: true })
  @IsOptional()
  @CommentOrPost(CreateLikeInput, (cli) => cli.postId, {
    message: "Must provide either commentId or postId, not both or neither",
  })
  commentId?: number;

  @Field(() => Int, { description: 'Post with like', nullable: true })
  @IsOptional()
  postId?: number;
}
