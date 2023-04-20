import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { User } from 'users/entities/user.entity';
import { EntityOwnsLike } from 'posts/enum/entity-owns-like.enum';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Resolver(() => Like)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => Like)
  createLike(@Args('createLikeInput') createLikeInput: CreateLikeInput, @Context() ctx: any) {
    try {
      const createdLike = this.likesService.create(createLikeInput, ctx.req.user as User);
      return createdLike;
      
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        console.log(error + "\n\n\n");
      }
      console.log(error);
    }
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
