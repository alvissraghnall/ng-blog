import { InputType, Int, Field } from '@nestjs/graphql';
import { Allow, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Post } from 'posts/entities/post.entity';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Comment text content' })
  @IsNotEmpty()
  text: string;

  @Field(() => Int, { description: 'ID of Post that was commented on' })
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
