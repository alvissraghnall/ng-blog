import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';

@Module({
  providers: [LikesResolver, LikesService]
})
export class LikesModule {}
