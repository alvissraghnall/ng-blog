import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./entities/user.entity";
import { UserSubscriber } from './users.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UsersResolver, UsersService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
