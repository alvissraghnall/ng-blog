import { Category } from "../enum/category.enum";

export interface CreatePostInput {
    
    title: string;

    content: string;

    image: string;

    desc: string;

    category: Category;
}