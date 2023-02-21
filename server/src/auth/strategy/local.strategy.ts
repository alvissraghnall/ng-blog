import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        console.log(username, password);
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new BadRequestException("User with name: " + username + " does not exist!");
        }
        return user;
    }
    
}