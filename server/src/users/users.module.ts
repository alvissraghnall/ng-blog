import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './users.subscriber';
import { HashModule } from '../auth/hash/hash.module';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { JwtStrategy } from 'auth/strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';
import { UserFollow } from './entities/user-follow.entity';
import { SharedJwtModule } from 'common/shared-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFollow]),
    HashModule,
    SharedJwtModule,
  ],
  providers: [UsersResolver, UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
