import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
// import { AuthResolver } from './auth.resolver';
import { HashService } from './hash/hash.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      signOptions: {
        expiresIn: "10d",
        
      }
    }),
    UsersModule
  ],
  providers: [, AuthService, HashService, LocalStrategy],
  exports: [HashService]
})
export class AuthModule {}
