import { InputType, Int, Field } from '@nestjs/graphql';
import { Match } from 'auth/validator/match.validator';
import { IsAlphanumeric, IsAscii, IsEmail, MinLength,  } from "class-validator";
import { IsUnique } from 'common/is-unique';

@InputType()
export class CreateUserInput {

  @Field(() => String, { description: "Username" })
  @MinLength(3)
  @IsAscii()
  @IsUnique("user", "username", { always: true, message: 'username already exists' })
  username: string;

  @Field(() => String, { description: "User email address" })
  @IsEmail()
  @IsUnique("user", "email", { always: true, message: 'email already exists' })
  email: string;

  @Field(() => String, { description: "User password" })
  @IsAscii()
  @MinLength(8)
  password: string;

  @Field(() => String, { description: "User confirm password" })
  @IsAscii()
  @MinLength(8)
  @Match<CreateUserInput>("password")
  confirmPassword: string;

  @Field(() => String, { 
    description: "User display photo (avatar)",
    nullable: true
  })
  avatar?: string;
}
