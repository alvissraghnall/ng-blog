import { User } from "./User.model";

export interface Like {
    id: number;
    owner: Partial<User>
}