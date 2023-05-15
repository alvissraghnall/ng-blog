import { Category } from "./enum/category.enum";
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { Like } from "./Like.model";
import { BaseModel } from "./BaseModel";

export interface Post extends BaseModel {
    title: string;
    desc: string;
    image: string;
    content: string;
    category: Category;
    comments: Comment[];
    likes: User[];
    author: User;  
}