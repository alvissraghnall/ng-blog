import { gql } from "apollo-angular";
import { Category } from "../models/enum/category.enum";

export class PostsQueries {

    static GET_POSTS (cat?: Category, authorId?: string) {
        let args = ``;
        args += cat ? '(cat:' + cat + ')' : '';
        args += authorId ? '(authorId:' + authorId + ')' : '';
        return gql`
            {
                posts ${args} {
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

    static GET_POST (id: number) {
        return gql`
            {
                post (id: ${id}) {
                    content
                    category
                    id
                    desc
                    title
                    author {
                        id
                        username
                        avatar
                    }
                    createdAt
                    likes {
                        id
                        owner {
                            id
                            username
                        }
                    }
                    comments {
                        text
                        author {
                            username
                            id
                            avatar
                        }
                        createdAt
                        id
                        likes {
                            id
                            owner {
                                username
                                id
                            }
                        }
                    }
                }
            }
        `;
    }

    static CREATE_POST () {
        return gql`
            mutation createPost ($input: CreatePostInput!) {
                createPost (createPostInput: $input) {
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