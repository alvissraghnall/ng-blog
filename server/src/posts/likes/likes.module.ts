import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { PostsModule } from 'posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]),
  ],
  providers: [LikesResolver, LikesService],
  exports: [LikesService]
})
export class LikesModule {}
