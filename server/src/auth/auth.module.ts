import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
// import { AuthResolver } from './auth.resolver';
import { HashModule } from './hash/hash.module';
import { JwtKeyModule } from './jwt/jwt-key.module';
import { JwtKeyService } from './jwt/jwt-key.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { GoogleOAuthStrategy } from './strategy/google-oauth.strategy';
import { GithubOAuthStrategy } from './strategy/github-oauth.strategy';
import { OAuthService } from './oauth/oauth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule, JwtKeyModule],
      useFactory: async (
        configService: ConfigService,
        keyService: JwtKeyService,
      ) => {
        console.log(configService.get<string>('JWT_EXP_IN'));
        return {
          privateKey: await keyService.getPrivKey(),
          publicKey: await keyService.getPubKey(),
          signOptions: {
            expiresIn: configService.get<number>('JWT_EXP_IN'),
            algorithm: 'RS256',
            issuer: 'ng-blog',
          },
          verifyOptions: { algorithms: ['RS256'] },
        };
      },

      inject: [ConfigService, JwtKeyService],
    }),
    UsersModule,
    HashModule,
    JwtKeyModule,
    ConfigModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AuthResolver,
    JwtKeyService,
    JwtStrategy,
    GoogleOAuthStrategy,
    GithubOAuthStrategy,
    OAuthService,
    ConfigService,
  ],
  exports: [AuthService, JwtKeyService],
})
export class AuthModule {}
