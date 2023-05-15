import { DataSource } from 'typeorm';
import { ExecutionContext, Injectable, CanActivate, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { JwtKeyService } from "auth/jwt/jwt-key.service";
import { JwtResponsePayload } from "auth/jwt/jwt-response.payload";
import { IS_PUBLIC_KEY } from "common/public.decorator";
import { IncomingMessage } from "http";
import { User } from 'users/entities/user.entity';
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private readonly jwtKeyService: JwtKeyService,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly datasource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest<
            IncomingMessage & { user?: User }
        >(context);

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic) return true;

        const jwtVerifyOpts: JwtVerifyOptions = {
            algorithms: ["RS256"],
            publicKey: await this.jwtKeyService.getPubKey()
        }

        try {
            const token = this.getToken(request);
            const user = this.jwtService.verify<JwtResponsePayload>(token, jwtVerifyOpts);
            request.user = await this.datasource
                .getRepository(User)
                .findOneBy({id: user.sub});

            console.log("gqlauth guard: ", user, request.user);
            return true;
        } catch (error) {
            console.log(error);
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException("Expired JWT Token.");
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException("Invalid JWT Token provided.");
            }
            throw new UnauthorizedException(error.message);
        }
    }

    protected getRequest<T> (context: ExecutionContext): T {
        const ctx = GqlExecutionContext.create(context);

        return ctx.getContext().req;
    }

   
    protected getToken(request: {
        headers: Record<string, string | string[]>
    }): string {
        const authorization = request.headers["authorization"];
        const BEARER = "Bearer ";

        if (!authorization || Array.isArray(authorization) || !authorization.startsWith(BEARER)) {
            throw new BadRequestException("Invalid Authorization Header");
        }

        const token = authorization.replace(BEARER, "");
        console.log(token);
        
        return token;
    }

}