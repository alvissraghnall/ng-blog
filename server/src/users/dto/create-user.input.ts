import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlphanumeric, IsEmail, MinLength,  } from "class-validator";
import { IsUnique } from 'common/is-unique';

@InputType()
export class CreateUserInput {

  @Field(() => String, { description: "Username" })
  @MinLength(3)
  @IsAlphanumeric()
  @IsUnique("user", "username", { always: true, message: 'username already exists' })
  username: string;

  @Field(() => String, { description: "User email address" })
  @IsEmail()
  @IsUnique("user", "email", { always: true, message: 'email already exists' })
  email: string;

  @Field(() => String, { description: "User password" })
  @IsAlphanumeric()
  @MinLength(8)
  password: string;

  @Field(() => String, { 
    description: "User display photo (avatar)",
    nullable: true
  })
  avatar?: string;
}
