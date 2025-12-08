import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'posts/entities/tag.entity';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';

@Module({
  providers: [SearchResolver, SearchService],
  imports: [TypeOrmModule.forFeature([Tag, Post, User])],
})
export class SearchModule {}
