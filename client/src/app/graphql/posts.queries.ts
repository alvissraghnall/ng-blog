import { gql } from "apollo-angular";

export class PostsQueries {

    static GET_POSTS = gql`
        query posts($category: Category, $authorId: String) {
            posts(category: $category, authorId: $authorId) {
                content
                category
                id
                desc
                image
                title
                author {
                    id
                    username
                }
                createdAt
                likes {
                    id
                    owner {
                        id
                        username
                    }
                }
            }
        }
    `;

    static GET_POST = gql`
        query post($id: Int!) {
            post(id: $id) {
                content
                category
                id
                desc
                title
                image
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
                            id
                            username
                        }
                    }
                }
            }
        }
    `;

    static CREATE_POST = gql`
        mutation createPost($input: CreatePostInput!) {
            createPost(createPostInput: $input) {
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

    static LIKE_POST = gql`
        mutation toggleLike($input: CreateLikeInput!) {
            toggleLike(createLikeInput: $input) {
                id
                owner {
                    id
                    username
                }
            }
        }
    `;
}
