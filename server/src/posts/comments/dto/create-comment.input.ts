import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber,  } from 'class-validator';

@InputType()
export class CreateCommentInput {

  @Field(() => String, { description: 'Comment text content' })
  @IsNotEmpty()
  text: string;

  @Field(() => Int, { description: "ID of Post that was commented on" })
  @IsNumber()
  @IsNotEmpty()
  postId: number;

}
