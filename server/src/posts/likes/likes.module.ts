import { Logger, Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Comment } from 'posts/comments/entities/comment.entity';
import { Post } from 'posts/entities/post.entity';
import { EntityOwnerGuard } from 'common/guards/entity-owner.guard';
import { EntityExistsGuard } from 'common/guards/entity-exists.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, Comment])],
  providers: [
    LikesResolver,
    LikesService,
    Logger,
    EntityOwnerGuard,
    EntityExistsGuard,
  ],
  exports: [LikesService],
})
export class LikesModule {}
