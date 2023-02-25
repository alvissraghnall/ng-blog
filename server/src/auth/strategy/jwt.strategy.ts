import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "users/entities/user.entity";
import { JwtKeyService } from "../jwt/jwt-key.service";
import { JwtPayload } from "../jwt/jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor (
        private readonly jwtKeyService: JwtKeyService,
        // private readonly authService: AuthService    
    ) {
        super({
            jwtFromRequest: (request: Promise<Request>) => {
                // if(await request && (await request).headers) {
                //     console.log(((await request).headers["authorization"] as string).replace("Bearer ", ""))
                //     // return ((await request).headers["authorization"] as string).replace("Bearer ", "").toString().trim()
                //     return (await request).headers["as_token"].toString().trim()
                // }
                return "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNodGFyYm95MTkwMCIsInN1YiI6IjA4ZDcxNzkzLWI5ODMtNGRkYy04ZTlkLWY5YTlhMjQwYjY3MyIsImlhdCI6MTY3Njk0ODQyNiwiZXhwIjoxNjc3ODEyNDI2LCJpc3MiOiJuZy1ibG9nIn0.TQJwtF2ss1Wl53FXuOjJ_uMtA7SLdFHQg9YMtdq2JDOFAXqj-vvemSXj0g_ZhrlWl8t7I3hbzyH-l82vwvXQncUqk2CUZnNC4s-BMX_ro424YaUsCOhhJ_p9iRmKXyXgPiO0_NjNZPRW6kF3n1H4yqbAto261ddMZJofeeNpr_OsJKfm3hCIvD1yC7ZQhCYjIHgfV4Es-QH4FpLYZ677fNRjX5dRExzMLbOJkLyoiB1-Viyn_PQvp0HvDKLRhVKeUgV7lBHjNpeDi3GLWxwvOXz92T2B2wRdJPDfWRl9pcDlUUvOPHYdId183M_gXrC8E-dDoRi8ms4r4VLM7VgBIw";
            },
            // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
            secretOrKey: async () => await jwtKeyService.getPubKey(),
            // secretOrKey: ,
            logging: true,
            ignoreExpiration: false,
            algorithms: ["RS256"],
            issuer: "ng-blog"
        });
        // console.log(this, 57978, { "bj": "nkkl"});
    }

    async validate(payload: JwtPayload) {
        console.log(35, payload);
        // const user = await this.authService.validateUserByPayload(payload);
        // console.log(user);
        // if (!user) throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);

        // return user;

    }

}