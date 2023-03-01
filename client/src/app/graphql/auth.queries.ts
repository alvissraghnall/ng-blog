import { gql } from "apollo-angular";

export const CREATE_USER = gql`
    mutation signup ($input: CreateUserInput!) {
        signup (createUserInput: $input) {
            id
            username
            email
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login ($input: LoginUserInput!) {
        login (loginUserInput: $input) {
            user {
                id
                username
                email
                avatar
            }
            access_token
        }
    }
`;