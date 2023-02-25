import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Like } from 'posts/likes/entities/like.entity';

@Module({
  providers: [CommentsResolver, CommentsService],
  imports: [
    TypeOrmModule.forFeature([Comment])
  ],
  exports: [CommentsService]
})
export class CommentsModule {}
