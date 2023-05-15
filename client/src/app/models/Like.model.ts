import { User } from "./User.model";
import { BaseModel } from "./BaseModel";

export interface Like extends BaseModel {
    id: number;
    owner: Partial<User>
}