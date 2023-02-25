import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";
import { UserSubscriber } from './users.subscriber';
import { HashModule } from '../auth/hash/hash.module';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { JwtStrategy } from 'auth/strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';
// import { JwtStrategy } from 'auth/strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HashModule,
    JwtKeyModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, JwtKeyModule],
      useFactory: async (configService: ConfigService, keyService: JwtKeyService) => {
        console.log(configService.get<string>("JWT_EXP_IN"));
        return {
          privateKey: await keyService.getPrivKey(),
          publicKey: await keyService.getPubKey(), 
          signOptions: { expiresIn: configService.get<string>("JWT_EXP_IN"), algorithm: 'RS256', issuer: "ng-blog" },
          verifyOptions: { algorithms: ["RS256"] },
        };
      },
      
      inject: [ConfigService, JwtKeyService]
    })
  ],
  providers: [UsersResolver, UsersService, UserSubscriber, JwtStrategy ],
  exports: [UsersService]
})
export class UsersModule {}
