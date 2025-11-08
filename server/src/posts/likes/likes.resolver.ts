import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { User } from 'users/entities/user.entity';
import { EntityOwnsLike } from 'posts/enum/entity-owns-like.enum';
import { CurrentUser } from 'common/current-user.decorator';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  CheckEntityOwner,
  OwnedEntity,
} from 'common/decorators/entity-owner.decorator';
import { EntityOwnerGuard } from 'common/guards/entity-owner.guard';
import { Public } from 'common/public.decorator';

@Resolver(() => Like)
@UseGuards(GqlJwtAuthGuard)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => Like)
  async toggleLike(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user: User,
  ) {
    const like = await this.likesService.toggleLike(createLikeInput, user);
    console.log(like);
    return like;
  }

  @Query(() => [Like], { name: 'likes' })
  @Public()
  getLikesOnContent(
    @Args('id', { type: () => Int }) id: number,
    @Args('entity', { type: () => EntityOwnsLike }) entityName: EntityOwnsLike,
  ) {
    return this.likesService.findForPostOrComment(id, entityName);
  }

  @Query(() => Int, { name: 'likeCount' })
  @Public()
  getLikeCount(
    @Args('id', { type: () => Int }) id: number,
    @Args('entity', { type: () => EntityOwnsLike }) entity: EntityOwnsLike,
  ) {
    return this.likesService.getLikeCount(id, entity);
  }

  @Query(() => Boolean, { name: 'hasUserLiked' })
  hasUserLiked(
    @Args('entityId', { type: () => Int }) entityId: number,
    @Args('entity', { type: () => EntityOwnsLike }) entity: EntityOwnsLike,
    @CurrentUser() user: User,
  ) {
    return this.likesService.hasUserLikedEntity(user.id, entityId, entity);
  }

  @Query(() => Like, { name: 'like' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.likesService.findOne(id);
  }

  @Mutation(() => Like)
  @UseGuards(EntityOwnerGuard)
  @CheckEntityOwner({
    entity: Like,
    idExtractor: (args) => args.id,
    ownerKey: 'owner',
  })
  removeLike(
    @Args('id', { type: () => Int }) id: number,
    @OwnedEntity() like: Like,
  ) {
    return this.likesService.remove(like);
  }
}
