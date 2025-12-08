import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { Tag } from 'posts/entities/tag.entity';
import { UserAnalytics } from './dto/user-analytics.input';
import { PostAnalytics } from './dto/post-analytics.input';
import { TrendingTag } from './dto/trending-tag-analytics.input';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Post) private postsRepo: Repository<Post>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Tag) private tagsRepo: Repository<Tag>,
  ) {}

  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .loadRelationCountAndMap('user.followerCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    const stats = await this.postsRepo
      .createQueryBuilder('post')
      .select('COUNT(post.id)', 'totalPosts')
      .addSelect('SUM(post.views)', 'totalViews')
      .leftJoin('post.likes', 'like')
      .addSelect('COUNT(like.id)', 'totalLikes')
      .leftJoin('post.comments', 'comment')
      .addSelect('COUNT(comment.id)', 'totalComments')
      .where('post.author.id = :userId', { userId })
      .getRawOne();
    // getRawOne returns strings for counts, need to parse them

    const totalPosts = Number(stats.totalPosts) || 0;
    const totalLikes = Number(stats.totalLikes) || 0;
    const totalComments = Number(stats.totalComments) || 0;
    const postViews = Number(stats.totalViews) || 0;
    const followerCount = user.followerCount || 0;

    // ((Likes + Comments) / Followers) * 100
    const interactions = totalLikes + totalComments;
    const engagementRate =
      followerCount > 0 ? (interactions / followerCount) * 100 : 0;

    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalFollowers: followerCount,
      totalFollowing: user.followingCount || 0,
      postViews,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
    };
  }

  async getPostAnalytics(slug: string, userId: string): Promise<PostAnalytics> {
    const post = await this.postsRepo.findOne({
      where: { slug },
      relations: ['author', 'likes', 'comments'],
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to view analytics for this post.',
      );
    }

    const views = post.views || 0;
    const likes = post.likes.length;
    const comments = post.comments.length;

    const interactions = likes + comments;
    const engagementRate = views > 0 ? (interactions / views) * 100 : 0;

    return {
      views,
      likes,
      comments,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
    };
  }

  async getTrendingTags(
    limit: number,
    timeRange: 'day' | 'week' | 'month',
  ): Promise<TrendingTag[]> {
    let dateThreshold = new Date();
    if (timeRange === 'day') dateThreshold.setDate(dateThreshold.getDate() - 1);
    if (timeRange === 'week')
      dateThreshold.setDate(dateThreshold.getDate() - 7);
    if (timeRange === 'month')
      dateThreshold.setDate(dateThreshold.getDate() - 30);

    // Join Tag -> PostTags -> Post
    // Filter by Post.createdAt > threshold
    // Group by Tag
    return this.tagsRepo
      .createQueryBuilder('tag')
      .innerJoin('tag.posts', 'post') // Only tags that have posts
      .where('post.createdAt > :dateThreshold', { dateThreshold })
      .select('tag.name', 'name')
      .addSelect('COUNT(post.id)', 'count')
      .groupBy('tag.name')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
    // Returns { name: 'tech', count: '55' }
  }

  async incrementPostView(slug: string) {
    await this.postsRepo.increment({ slug }, 'views', 1);
  }
}
