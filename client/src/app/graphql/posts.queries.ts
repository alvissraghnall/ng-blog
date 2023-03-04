import { gql } from "apollo-angular";
import { Category } from "../models/enum/category.enum";

export class PostsQueries {

    static GET_POSTS (cat?: Category) {
        return gql`
            {
                posts ${cat ? '(cat:' + cat + ')' : ''} {
                    content
                    category
                    id
                    desc
                    title
                    author {
                        id
                        username
                    }
                    createdAt
                }
            }
        `;
    }
}