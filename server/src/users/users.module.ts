import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";
import { UserSubscriber } from './users.subscriber';
// import { HashService } from '../auth/hash/hash.service';
import { HashModule } from '../auth/hash/hash.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HashModule
  ],
  providers: [UsersResolver, UsersService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
