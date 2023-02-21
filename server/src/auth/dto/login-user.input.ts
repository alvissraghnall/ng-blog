import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MinLength, IsAlphanumeric } from "class-validator";


@InputType()
export class LoginUserInput {

    @Field()
    @MinLength(3)
    @IsAlphanumeric()
    username: string;

    @Field()
    @MinLength(8)
    @IsAlphanumeric()
    password: String;
}