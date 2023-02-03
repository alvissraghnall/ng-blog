import { Field, ObjectType } from "@nestjs/graphql";
import { CreateUserInput } from "src/users/dto/create-user.input";
import { User } from "src/users/entities/user.entity";

@ObjectType()
export class LoginResponse {

    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}