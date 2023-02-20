import { Field, ObjectType } from "@nestjs/graphql";
import { CreateUserInput } from "../../users/dto/create-user.input";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class LoginResponse {

    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}