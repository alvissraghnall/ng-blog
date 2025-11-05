import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';
import { APP_GUARD } from '@nestjs/core';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { LikesService } from './likes/likes.service';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
    PostsResolver,
    PostsService,
    JwtService,
  ],
  imports: [
    LikesModule,
    CommentsModule,
    TypeOrmModule.forFeature([Post]),
    UsersModule,
    CloudinaryModule,
    JwtKeyModule,
  ],
  exports: [PostsService],
})
export class PostsModule {}
