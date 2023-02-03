import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlphanumeric, IsEmail, MinLength,  } from "class-validator";

@InputType()
export class CreateUserInput {

  @Field(() => String, { description: "User username" })
  @MinLength(3)
  @IsAlphanumeric()
  username: string;

  @Field(() => String, { description: "User email address" })
  @IsEmail()
  email: string;

  @Field(() => String, { description: "User password" })
  @IsAlphanumeric()
  @MinLength(8)
  password: string;

  @Field(() => String, { description: "User display photo (avatar)" })
  avatar: string;
}
