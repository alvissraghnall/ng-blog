import { Like } from "./Like.model";
import { Post } from "./Post.model";
import { User } from "./User.model";

export interface Comment {
    id: number;
    text: string;
    post: Post;
    author: User;
    likes: Like[];
    createdAt: Date;
}