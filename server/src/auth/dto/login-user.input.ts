import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MinLength, IsAscii } from "class-validator";


@InputType()
export class LoginUserInput {

    @Field()
    @MinLength(3)
    @IsAscii()
    username: string;

    @Field()
    @MinLength(8)
    @IsAscii()
    password: String;
}