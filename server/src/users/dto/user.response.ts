import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";


export class UserResponse extends OmitType<User, keyof User>(User, ["password"] as const) {  };