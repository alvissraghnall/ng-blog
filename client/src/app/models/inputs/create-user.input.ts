
export interface CreateUserInput {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    avatar?: string | null
}