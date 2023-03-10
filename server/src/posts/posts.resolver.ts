import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Category } from './enum/category.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { JwtResponsePayload } from 'auth/jwt/jwt-response.payload';
import { Public } from 'common/public.decorator';
import { IsEnum } from 'class-validator';
import { User } from 'users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput, @Context() ctx: any) {
    console.log(createPostInput);
    
    return this.postsService.create(createPostInput, ctx.req.user as User);
  }

  @Public()
  @Query(() => [Post], { name: 'posts', nullable: true })
  async find(
    @Args("cat", { type: () => Category, nullable: true }) cat?: Category,
    @Args("authorId", { type: () => String, nullable: true }) authorId?: string
    ) {
    return await this.postsService.find(cat, authorId);
  }

  // @Public()
  // @Query(() => [Post], { name: "postsByAuthor" })
  // findByAuthor (@Args("id", { type: () => String }) id: string) {

  // }

  @Public()
  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    console.log(await this.postsService.findOne(id));
    return await this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput, @Context() ctx: any) {
    return this.postsService.update(updatePostInput, ctx.req.user as User);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.remove(id);
  }
}
