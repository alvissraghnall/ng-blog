import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Category } from './enum/category.enum';
import { UseGuards } from '@nestjs/common';
import { Public } from 'common/public.decorator';
import { User } from 'users/entities/user.entity';
import { CurrentUser } from 'common/current-user.decorator';
import { EntityOwnerGuard } from 'common/guards/entity-owner.guard';
import {
  CheckEntityOwner,
  OwnedEntity,
} from 'common/decorators/entity-owner.decorator';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ) {
    // console.log(createPostInput.desc);
    console.log(user);
    return this.postsService.create(createPostInput, user);
  }

  @Public()
  @Query(() => [Post], {
    name: 'posts',
    description: 'Get posts with optional filtering by category and/or author',
  })
  findPosts(
    @Args('category', { type: () => Category, nullable: true })
    category?: Category,
    @Args('authorId', { type: () => String, nullable: true }) authorId?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.postsService.findAll({
      category,
      authorId,
      limit,
      offset,
    });
  }

  @Public()
  @Query(() => [Post], {
    name: 'postsByAuthor',
    nullable: true,
    description: 'Get all posts by a specific author',
  })
  findPostsByAuthor(
    @Args('authorId', { type: () => String }) authorId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.postsService.findByAuthor(authorId, limit);
  }

  @Public()
  @Query(() => [Post], {
    name: 'postsByCategory',
    nullable: true,
    description: 'Get all posts in a specific category',
  })
  findPostsByCategory(
    @Args('category', { type: () => Category }) category: Category,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.postsService.findByCategory(category, limit);
  }

  @Public()
  @Query(() => [Post], {
    name: 'popularPosts',
    nullable: true,
    description: 'Get most popular posts ordered by likes',
  })
  getPopularPosts(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ) {
    return this.postsService.getPopularPosts(limit);
  }

  @Public()
  @Query(() => [Post], {
    name: 'recentPosts',
    nullable: true,
    description: 'Get most recent posts',
  })
  getRecentPosts(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ) {
    return this.postsService.getRecentPosts(limit);
  }

  @Public()
  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Public()
  @Query(() => Int, {
    name: 'postCount',
    description: 'Get total count of posts with optional filtering',
  })
  getPostCount(
    @Args('category', { type: () => Category, nullable: true })
    category?: Category,
    @Args('authorId', { type: () => String, nullable: true }) authorId?: string,
  ) {
    return this.postsService.getPostCount({ category, authorId });
  }

  @Mutation(() => Post)
  @UseGuards(EntityOwnerGuard)
  @CheckEntityOwner({
    entity: Post,
    idExtractor: (args) => args.updatePostInput.id,
    ownerKey: 'author',
  })
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
    @OwnedEntity() post: Post,
  ) {
    return this.postsService.update(updatePostInput, user, post);
  }

  @Mutation(() => Post)
  @UseGuards(EntityOwnerGuard)
  @CheckEntityOwner({
    entity: Post,
    idExtractor: (args) => args.id,
    ownerKey: 'author',
  })
  removePost(
    @Args('id', { type: () => Int }) id: number,
    @OwnedEntity() post: Post,
  ) {
    return this.postsService.remove(id, post);
  }

  @ResolveField(() => Int, { name: 'likeCount' })
  async getLikeCount(@Parent() post: Post): Promise<number> {
    // If likes are already loaded, return count
    if (post.likes) {
      return post.likes.length;
    }
    // Otherwise fetch count from database
    const fullPost = await this.postsService.findOne(post.id, true);
    return fullPost.likes?.length || 0;
  }

  @ResolveField(() => Int, { name: 'commentCount' })
  async getCommentCount(@Parent() post: Post): Promise<number> {
    if (post.comments) {
      return post.comments.length;
    }
    const fullPost = await this.postsService.findOne(post.id, true);
    return fullPost.comments?.length || 0;
  }
}
