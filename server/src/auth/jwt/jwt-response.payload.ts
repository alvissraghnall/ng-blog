

export interface JwtResponsePayload {

    username: string;

    sub: string;

    iat: number;

    exp: number;

    iss: string;
}