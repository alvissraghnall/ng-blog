import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateCommentInput extends OmitType(CreateCommentInput, ["postId"]) {
  @Field(() => Int, { description: "ID of comment to be updated." })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
