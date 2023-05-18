import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Category } from './enum/category.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtResponsePayload } from 'auth/jwt/jwt-response.payload';
import { Public } from 'common/public.decorator';
import { IsEnum } from 'class-validator';
import { User } from 'users/entities/user.entity';
import { LikePostInput } from './dto/like-post.input';
import { Like } from './likes/entities/like.entity';
import { LikesService } from './likes/likes.service';
import { CurrentUser } from 'common/current-user.decorator';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    ) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput, @CurrentUser() user: User) {
    console.log(createPostInput.desc);
    console.log(user);
    return this.postsService.create(createPostInput, user as User);
  }

  @Mutation(() => Post)
  async likePost (@Args('postId', { type: () => Int }) postId: number, @CurrentUser() currUser: User, @Context() ctx: any) {
    console.log("Curr User: ", currUser);
    console.log("ctx user: ", ctx.req.user);
    const user = ctx.req.user as User;
    const post = await this.postsService.findOne(postId);
    
    let savedPost: Post;
    console.log("User: ", user);

    if (!post) throw new NotFoundException("Post with ID: " + postId + " not found!");

    const likesIndex = post.likes.findIndex(like => like.id === user.id);
    console.log(post.likes);

    if (likesIndex === -1) {
      // const newLike = new Like();
      // newLike.post = post;
      // newLike.owner = user;
      // this.likesService.saveLike(newLike).then(r => {       
      // });
      post.likes.push(user);
      console.log("Post likes post-append: ", post.likes);
    } else {
      post.likes.splice(likesIndex, 1)[0];
      console.log("Post likes post-delete: ", post.likes);
    }
    savedPost = await this.postsService.save(post);

    console.log(savedPost.likes, post.likes);
    return savedPost;
  }

  @Public()
  @Query(() => [Post], { name: 'posts', nullable: true, description: "Get posts by category, and/or author ID" })
  async find(
    @Args("cat", { type: () => Category, nullable: true }) cat?: Category,
    @Args("authorId", { type: () => String, nullable: true }) authorId?: string
    ) {
    return await this.postsService.find({cat, authorId});
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
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput, @CurrentUser() user: User) {
    return this.postsService.update(updatePostInput, user);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.remove(id);
  }
}
