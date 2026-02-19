import { InputType, Int, Field } from '@nestjs/graphql';
import { Allow, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { Post } from 'posts/entities/post.entity';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Comment text content' })
  @IsNotEmpty()
  text: string;

  @Field(() => GraphQLUpload, { 
    description: 'Comment image', 
    nullable: true 
  })
  @IsOptional()
  image?: FileUpload;

  @Field(() => Int, { description: 'ID of Post that was commented on' })
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
