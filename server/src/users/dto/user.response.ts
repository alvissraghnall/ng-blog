import { OmitType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";


export class UserResponse extends OmitType<User, keyof User>(User, ["password"] as const) {  };
