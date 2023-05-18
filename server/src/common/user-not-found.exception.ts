
export class UserNotFoundException extends Error {
    constructor(id: string, message: string = `User with ID: ${id} not found!`) {
        super(message);
    }
}