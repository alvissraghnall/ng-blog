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

export const CHECK_AUTH_USER_TOKEN = gql`
    { checkJwt }
`;

export const WHO_AM_I = gql`
    whoami {
        username
        id
        bio
        username
        email
        avatar
        followers {
            id 
            username
        }
        following {
            id 
            username
        }
    } 
`;