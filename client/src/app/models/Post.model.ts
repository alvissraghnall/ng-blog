import { Category } from "./enum/category.enum";
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { Like } from "./Like.model";

export interface Post {
    id: number;
    title: string;
    desc: string;
    image: string;
    content: string;
    category: Category;
    comments: Comment[];
    likes: Like[];
    author: User;  
    createdAt: Date;
    updatedAt: Date;
}