import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { User } from 'users/entities/user.entity';
import { EntityOwnsLike } from 'posts/enum/entity-owns-like.enum';

@Resolver(() => Like)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => Like)
  createLike(@Args('createLikeInput') createLikeInput: CreateLikeInput, @Context() ctx: any) {
    return this.likesService.create(createLikeInput, ctx.req.user as User);
  }

  @Query(() => [Like], { name: 'likes' })
  getLikesOnContent(@Args("id", { type: () => Int }) id: number, 
    @Args("entity", { type: () => EntityOwnsLike }) entityName: EntityOwnsLike
  ) {
    return this.likesService.find(id, entityName);
  }

  @Query(() => Like, { name: 'like' })
  findOne(@Args('id', { type: () => Int }) id: number
  ) {
    return this.likesService.findOne(id);
  }


  @Mutation(() => Like)
  removeLike(@Args('id', { type: () => Int }) id: number) {
    return this.likesService.remove(id);
  }
}
