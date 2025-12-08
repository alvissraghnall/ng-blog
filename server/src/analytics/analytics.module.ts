import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { Tag } from 'posts/entities/tag.entity';

@Module({
  providers: [AnalyticsResolver, AnalyticsService],
  imports: [TypeOrmModule.forFeature([Post, User, Tag])],
})
export class AnalyticsModule {}
