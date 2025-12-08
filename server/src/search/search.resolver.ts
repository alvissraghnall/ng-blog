import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { Public } from 'common/public.decorator';
import { Tag } from 'posts/entities/tag.entity';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Query(() => [Post], { name: 'searchPosts' })
  searchPosts(
    @Args('query') query: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    if (query.length < 2) return [];
    return this.searchService.searchPosts(query, limit, offset);
  }

  @Public()
  @Query(() => [User], { name: 'searchUsers' })
  searchUsers(
    @Args('query') query: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    if (query.length < 2) return [];
    return this.searchService.searchUsers(query, limit, offset);
  }

  @Public()
  @Query(() => [Tag], { name: 'searchTags' })
  searchTags(
    @Args('query') query: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    if (query.length < 2) return [];
    return this.searchService.searchTags(query, limit);
  }
}
