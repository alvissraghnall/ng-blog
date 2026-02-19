import { Logger, Module, LoggerService } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Like } from 'posts/likes/entities/like.entity';
import { Post } from 'posts/entities/post.entity';
import { EntityOwnerGuard } from 'common/guards/entity-owner.guard';
import { EntityExistsGuard } from 'common/guards/entity-exists.guard';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';

@Module({
  providers: [
    CommentsResolver,
    CommentsService,
    Logger,
    EntityOwnerGuard,
    EntityExistsGuard,
  ],
  imports: [TypeOrmModule.forFeature([Comment, Post]), CloudinaryModule],
  exports: [CommentsService],
})
export class CommentsModule {}
