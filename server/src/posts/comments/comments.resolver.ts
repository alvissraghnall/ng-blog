import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { User } from 'users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CurrentUser } from 'common/current-user.decorator';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(@Args('createCommentInput') createCommentInput: CreateCommentInput, @Context() context: any) {
    return this.commentsService.create(createCommentInput, context.req.user as User);
  }

  @Mutation(() => Comment)
  async likeComment (@Args('commentId', { type: () => Int }) commentId: number, @CurrentUser() currUser: User) {
    console.log("Curr User: ", currUser);
    const comment = await this.commentsService.findOne(commentId);
    
    let savedComment: Comment;

    if (!comment) throw new NotFoundException("Comment with ID: " + commentId + " not found!");

    const likesIndex = comment.likes.findIndex(like => like.id === currUser.id);
    console.log(comment.likes);

    if (likesIndex === -1) {
      comment.likes.push(currUser);
      console.log("Comment likes post-append: ", comment.likes);
    } else {
      comment.likes.splice(likesIndex, 1)[0];
      console.log("Comment likes post-delete: ", comment.likes);
    }
    savedComment = await this.commentsService.add(comment);

    console.log(savedComment.likes, comment.likes);
    return savedComment;
  }

  @Query(() => [Comment], { name: 'comments' })
  getCommentsOnPost(@Args("postId", {type: () => Int}) postId: number ) {
    return this.commentsService.findAllOnPost(postId);
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => Comment)
  updateComment(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentsService.update(updateCommentInput);
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.remove(id);
  }
}
