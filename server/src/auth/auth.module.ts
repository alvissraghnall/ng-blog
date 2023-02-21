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

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, JwtKeyModule],
      useFactory: async (configService: ConfigService, keyService: JwtKeyService) => {
        return {
          privateKey: await keyService.getPrivKey(),
          publicKey: await keyService.getPubKey(), 
          signOptions: { expiresIn: '10d', algorithm: 'RS256', issuer: "ng-blog" },
          verifyOptions: { algorithms: ["RS256"] },
        };
      },
      
      inject: [ConfigService, JwtKeyService]
    }),
    UsersModule,
    HashModule
  ],
  providers: [JwtStrategy, AuthService, LocalStrategy, AuthResolver, JwtKeyService ],
  exports: []
})
export class AuthModule {}
