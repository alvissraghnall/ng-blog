import { gql } from "apollo-angular";

export const CREATE_COMMENT = gql`
    mutation createComment ($input: CreateCommentInput!) {
        createComment(createCommentInput: $input) {
            id
            author {
                username
                id
            }
            post {
                id
            }
            likes {
                id
            }
        }
    }
`;