import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { CurrentUser } from 'common/current-user.decorator';
import { User } from 'users/entities/user.entity';
import { AnalyticsService } from './analytics.service';
import { Public } from 'common/public.decorator';
import { TrendingTag } from './dto/trending-tag-analytics.input';
import { PostAnalytics } from './dto/post-analytics.input';
import { UserAnalytics } from './dto/user-analytics.input';
import { CheckEntityOwner } from 'common/decorators/entity-owner.decorator';
import { Post } from 'posts/entities/post.entity';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => UserAnalytics, { name: 'userAnalytics' })
  @UseGuards(GqlJwtAuthGuard)
  getUserAnalytics(@CurrentUser() user: User) {
    return this.analyticsService.getUserAnalytics(user.id);
  }

  @Query(() => PostAnalytics, { name: 'postAnalytics' })
  @UseGuards(GqlJwtAuthGuard)
  getPostAnalytics(@Args('slug') slug: string, @CurrentUser() user: User) {
    return this.analyticsService.getPostAnalytics(slug, user.id);
  }

  @Query(() => [TrendingTag], { name: 'trendingTags' })
  @Public()
  getTrendingTags(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('timeRange', { type: () => String, defaultValue: 'week' })
    timeRange: 'day' | 'week' | 'month',
  ) {
    return this.analyticsService.getTrendingTags(limit, timeRange);
  }

  @Mutation(() => Boolean)
  @Public()
  async trackPostView(@Args('slug') slug: string) {
    await this.analyticsService.incrementPostView(slug);
    return true;
  }
}
