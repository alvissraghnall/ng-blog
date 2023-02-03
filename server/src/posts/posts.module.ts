import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  providers: [PostsResolver, PostsService],
  imports: [LikesModule, CommentsModule]
})
export class PostsModule {}
