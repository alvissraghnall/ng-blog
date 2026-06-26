import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateLikeInput } from './dto/create-like.input';
import { Like } from './entities/like.entity';
import { Comment } from 'posts/comments/entities/comment.entity';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { EntityOwnsLike } from 'posts/enum/entity-owns-like.enum';
import { CrudService } from 'common/service/crud.service';

@Injectable()
export class LikesService extends CrudService(Like) {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {
    super();
  }

  async toggleLike(
    createLikeInput: CreateLikeInput,
    user: User,
  ): Promise<Like> {
    const { commentId, postId } = createLikeInput;
    let post: Post, comment: Comment;

    if ((commentId && postId) || (!commentId && !postId)) {
      throw new BadRequestException(
        'Must provide either commentId or postId, not both or neither',
      );
    }

    const whereClause: FindOptionsWhere<Like> = { owner: { id: user.id } };

    if (postId) {
      post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new NotFoundException(`Post with id ${postId} not found`);
      }
      whereClause.post = { id: postId };
    }

    if (commentId) {
      comment = await this.commentsRepository.findOne({
        where: { id: commentId },
      });
      if (!comment) {
        throw new NotFoundException(`Comment with id ${commentId} not found`);
      }
      whereClause.comment = { id: commentId };
    }

    const existingLike = await this.likesRepository.findOne({
      where: whereClause,
      relations: ['owner', 'post', 'comment'],
    });

    if (existingLike) {
      const existingLikeId = existingLike.id;
      await this.likesRepository.remove(existingLike);
      return { ...existingLike, id: existingLikeId };
    }

    const newLike = this.likesRepository.create({
      owner: user,
      ...(postId && { post }),
      ...(commentId && { comment }),
    });

    return this.likesRepository.save(newLike);
  }

  async findForPostOrComment(
    entityId: number,
    entity: EntityOwnsLike,
  ): Promise<Like[]> {
    const whereClause: FindOptionsWhere<Like> =
      {} satisfies FindOptionsWhere<Like>;

    if (entity === EntityOwnsLike.POST) {
      whereClause.post = { id: entityId };
    } else if (entity === EntityOwnsLike.COMMENT) {
      whereClause.comment = { id: entityId };
    } else {
      throw new BadRequestException('Invalid entity type');
    }

    return this.likesRepository.find({
      where: whereClause,
      relations: ['owner', 'post', 'comment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Like> {
    const like = await this.likesRepository.findOne({
      relations: ['post', 'comment', 'owner', 'post.author', 'comment.author'],
      where: { id },
    });

    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found`);
    }

    return like;
  }

  async remove(like: Like): Promise<Like> {
    const id = like.id;
    const removed = await this.likesRepository.remove(like);
    return Object.assign(removed, { id });
  }

  async hasUserLikedEntity(
    userId: string,
    entityId: number,
    entity: EntityOwnsLike,
  ): Promise<boolean> {
    const whereClause: FindOptionsWhere<Like> = { owner: { id: userId } };

    if (entity === EntityOwnsLike.POST) {
      whereClause.post = { id: entityId };
    } else {
      whereClause.comment = { id: entityId };
    }

    const count = await this.likesRepository.count({ where: whereClause });
    return count > 0;
  }

  async getLikeCount(
    entityId: number,
    entity: EntityOwnsLike,
  ): Promise<number> {
    const whereClause: FindOptionsWhere<Like> = {};

    if (entity === EntityOwnsLike.POST) {
      whereClause.post = { id: entityId };
    } else {
      whereClause.comment = { id: entityId };
    }

    return this.likesRepository.count({ where: whereClause });
  }
}
