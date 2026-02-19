import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id: string;


  @Field(() => GraphQLUpload, {
    description: 'User display photo (avatar)',
    nullable: true,
  })
  avatar?: FileUpload;
}
