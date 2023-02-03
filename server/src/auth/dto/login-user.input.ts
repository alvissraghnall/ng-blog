import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class LoginUserInput {

    @Field()
    username: string;

    @Field()
    password: String;
}