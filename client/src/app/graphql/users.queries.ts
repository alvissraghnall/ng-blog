import { gql } from "apollo-angular";

export const GET_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            id
            username
            email
            avatar
            bio
            followers {
                id
                username
                avatar
            }
            following {
                id
                username
                avatar
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query findUserById($id: String!) {
        findUserById(id: $id) {
            id
            username
            email
            avatar
            bio
            followers {
                id
                username
                avatar
            }
            following {
                id
                username
                avatar
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation updateUser($input: UpdateUserInput!) {
        updateUser(updateUserInput: $input) {
            id
            username
            email
            avatar
            bio
        }
    }
`;

export const FOLLOW_USER = gql`
    mutation followUser($userToBeFollowedId: String!) {
        followUser(userToBeFollowedId: $userToBeFollowedId) {
            id
        }
    }
`;

export const UNFOLLOW_USER = gql`
    mutation unFollowUser($userToBeUnfollowedId: String!) {
        unFollowUser(userToBeUnfollowedId: $userToBeUnfollowedId) {
            id
            username
        }
    }
`;
