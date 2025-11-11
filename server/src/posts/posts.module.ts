import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'users/users.module';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { APP_GUARD } from '@nestjs/core';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { LikesService } from './likes/likes.service';
import { EntityExistsGuard } from 'common/guards/entity-exists.guard';
import { EntityOwnerGuard } from 'common/guards/entity-owner.guard';
import { Tag } from './entities/tag.entity';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
    PostsResolver,
    PostsService,
    JwtService,
    EntityExistsGuard,
    EntityOwnerGuard,
  ],
  imports: [
    LikesModule,
    CommentsModule,
    TypeOrmModule.forFeature([Post, Tag]),
    UsersModule,
    CloudinaryModule,
    JwtKeyModule,
  ],
  exports: [PostsService],
})
export class PostsModule {}
