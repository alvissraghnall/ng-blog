import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { JwtKeyService } from "../jwt/jwt-key.service";
import { JwtPayload } from "../jwt/jwt.payload";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor (
        private readonly jwtKeyService: JwtKeyService,
        private readonly authService: AuthService    
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtKeyService.getPrivKey(),
            logging: true,
            ignoreExpiration: false,
            algorithms: ["RS256"]
        });
    }

    async validate(payload: JwtPayload) {
        console.log(payload);
        const user = await this.authService.validateUserByPayload(payload);
        if (!user) throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);

        return user;

    }

}