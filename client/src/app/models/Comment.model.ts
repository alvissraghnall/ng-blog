import { BaseModel } from "./BaseModel";
import { Like } from "./Like.model";
import { Post } from "./Post.model";
import { User } from "./User.model";

export interface Comment extends BaseModel {
    text: string;
    post: Post;
    author: User;
    likes: User[];
}