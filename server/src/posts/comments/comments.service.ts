import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'posts/entities/post.entity';
import { Repository } from 'typeorm';
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

  async findAllOnPost(
    postId: number,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.post.id = :postId', { postId })

      .loadRelationCountAndMap('comment.likeCount', 'comment.likes')

      .orderBy('comment.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async findOne(id: number): Promise<Comment | null> {
    const comment = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.id = :id', { id })
      .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
      .getOne();

    return comment ?? null;
  }

  async update(
    updateCommentInput: UpdateCommentInput,
    comment: Comment,
  ): Promise<Comment> {
    Object.assign(comment, updateCommentInput);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, comment: Comment): Promise<Comment> {
    const removedComment = await this.commentsRepository.remove(comment);

    return Object.assign(removedComment, { id });
  }
}
