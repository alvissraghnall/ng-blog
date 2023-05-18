
export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    bio?: string;
    followers: User[];
    following: User[];
}