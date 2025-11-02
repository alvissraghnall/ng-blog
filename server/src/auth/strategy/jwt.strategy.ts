import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtKeyService } from '../jwt/jwt-key.service';
import { JwtPayload } from '../jwt/jwt.payload';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly jwtKeyService: JwtKeyService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          const publicKey = await jwtKeyService.getPubKey();
          done(null, publicKey);
        } catch (error) {
          done(error);
        }
      },
      ignoreExpiration: false,
      algorithms: ['RS256'],
      issuer: 'ng-blog',
      audience: 'ng-blog-app',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.authService.validateUserByPayload(payload);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message ?? 'Invalid token');
    }
  }
}
