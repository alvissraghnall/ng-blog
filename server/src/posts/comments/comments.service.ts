import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'posts/entities/post.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';
import { CommentBuilder } from './builders/comment.builder';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async create(
    createCommentInput: CreateCommentInput,
    post: Post,
    author: User,
  ): Promise<Comment> {
    const newComment = new CommentBuilder()
      .withAuthor(author)
      .withText(createCommentInput.text)
      .withPost(post)
      .build();

    return this.commentsRepository.save(newComment);
  }

  findAllOnPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['post', 'author', 'likes'],
    });
  }

  async findOne(id: number): Promise<Comment | null> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'likes'],
    });

    console.log(comment);
    return comment ?? null;
  }

  async update(
    updateCommentInput: UpdateCommentInput,
    comment: Comment,
  ): Promise<Comment> {
    /*
    const cmt = await this.commentsRepository.preload(updateCommentInput);
    if (!cmt)
      throw new BadRequestException(
        `Comment with ID: ${updateCommentInput.id} does not exist!`,
      );
	*/

    Object.assign(comment, updateCommentInput);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, comment: Comment): Promise<Comment> {
    const tbr = await this.commentsRepository.remove(comment);
    console.log(tbr, 5000);
    return Object.assign(tbr, { id }) ?? null;
  }

  add(comment: Comment) {
    return this.commentsRepository.save(comment);
  }
}
