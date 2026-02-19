import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class UpdateCommentInput extends OmitType(CreateCommentInput, [
  'postId',
]) {
  @Field(() => Int, { description: 'ID of comment to be updated.' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
  
  @Field(() => GraphQLUpload, { 
    description: 'Comment image', 
    nullable: true 
  })
  @IsOptional()
  image?: FileUpload;
}
