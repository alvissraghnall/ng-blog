import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { User } from 'users/entities/user.entity';
import {
  NotFoundException,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CurrentUser } from 'common/current-user.decorator';
import { Post } from 'posts/entities/post.entity';
import { FunctionExpression } from 'typescript';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { BaseEntity } from 'common/entities/base.entity';
import {
  CheckEntityOwner,
  OwnedEntity,
} from 'common/decorators/entity-owner.decorator';
import { EntityOwnerGuard } from 'common/guards/entity-owner.guard';
import { EntityExistsGuard } from 'common/guards/entity-exists.guard';
import {
  CheckEntityExists,
  CheckEntityExistsFor,
  FoundEntity,
} from 'common/decorators/entity-exists.decorator';
import { Public } from 'common/public.decorator';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  @UseGuards(GqlJwtAuthGuard, EntityExistsGuard)
  @CheckEntityExistsFor<
    {
      createCommentInput: CreateCommentInput;
    },
    Post
  >({
    entity: Post,
    idExtractor: 'createCommentInput.postId',
    // idExtractor: (args) => args.createCommentInput.postId,
  })
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: User,
    @FoundEntity('post') post: Post,
  ) {
    return this.commentsService.create(createCommentInput, post, user);
  }

  @Query(() => [Comment], { name: 'comments', nullable: true })
  @Public()
  async getCommentsOnPost(@Args('postId', { type: () => Int }) postId: number) {
    const cmt = await this.commentsService.findAllOnPost(postId);
    console.log(cmt);
    return cmt;
  }

  @Query(() => Comment, { name: 'comment', nullable: true })
  @Public()
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => Comment)
  @UseGuards(GqlJwtAuthGuard, EntityOwnerGuard)
  @CheckEntityOwner({
    entity: Comment,
    idExtractor: (args) => args.updateCommentInput?.id,
  })
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: User,
    @OwnedEntity() comment: Comment,
  ) {
    return this.commentsService.update(updateCommentInput, comment);
  }

  @Mutation(() => Comment)
  @UseGuards(GqlJwtAuthGuard, EntityOwnerGuard)
  @CheckEntityOwner({
    entity: Comment,
    idExtractor: (args) => args.id,
  })
  removeComment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
    @OwnedEntity() comment: Comment,
  ) {
    return this.commentsService.remove(id, comment);
  }
}
