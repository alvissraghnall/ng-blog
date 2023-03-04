import { User } from "../User.model";

export interface LoginResponse {

    access_token: string;

    user: User;
}