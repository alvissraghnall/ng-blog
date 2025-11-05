import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { User } from 'users/entities/user.entity';
import { EntityOwnsLike } from 'posts/enum/entity-owns-like.enum';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { CurrentUser } from 'common/current-user.decorator';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Like)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => Like)
  @UseGuards(GqlJwtAuthGuard)
  toggleLike(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user: User,
  ) {
    return this.likesService.toggleLike(createLikeInput, user);
  }

  @Query(() => [Like], { name: 'likes' })
  getLikesOnContent(
    @Args('id', { type: () => Int }) id: number,
    @Args('entity', { type: () => EntityOwnsLike }) entityName: EntityOwnsLike,
  ) {
    return this.likesService.find(id, entityName);
  }

  @Query(() => Like, { name: 'like' })
  @UseGuards(GqlJwtAuthGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.likesService.findOne(id);
  }

  @Mutation(() => Like)
  @UseGuards(GqlJwtAuthGuard)
  removeLike(@Args('id', { type: () => Int }) id: number) {
    return this.likesService.remove(id);
  }
}
