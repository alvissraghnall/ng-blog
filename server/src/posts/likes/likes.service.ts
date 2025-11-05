import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { Like } from './entities/like.entity';
import { Comment } from 'posts/comments/entities/comment.entity';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { EntityOwnsLike } from 'posts/enum/entity-owns-like.enum';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
    private readonly dataSource: DataSource,
  ) {}

  async toggleLike(createLikeInput: CreateLikeInput, user: User) {
    const { commentId, postId } = createLikeInput;

    if (!commentId && !postId) {
      throw new BadRequestException(
        'A post ID or comment ID must be provided.',
      );
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        owner: { id: user.id },
        ...(postId && { post: { id: postId } }),
        ...(commentId && { comment: { id: commentId } }),
      },
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return { ...existingLike, id: existingLike.id, removed: true };
    }

    if (postId) {
      const post = await this.dataSource
        .getRepository(Post)
        .findOneBy({ id: postId });
      if (!post)
        throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
    if (commentId) {
      const cmt = await this.dataSource
        .getRepository(Comment)
        .findOneBy({ id: commentId });
      if (!cmt)
        throw new NotFoundException(`Comment with ID ${commentId} not found.`);
    }

    const newLike = this.likesRepository.create({
      owner: user,
      post: postId ? { id: postId } : null,
      comment: commentId ? { id: commentId } : null,
    });

    return this.likesRepository.save(newLike);
  }

  async find(entityId: number, entity: EntityOwnsLike) {
    console.log(EntityOwnsLike.COMMENT === entity, entity.toString());

    const cntnt = await this.dataSource
      .getRepository<Post | Comment>(entity.toString().toLocaleLowerCase())
      .findOne({
        relations: ['likes'],
        where: { id: entityId },
      });

    console.log(cntnt);

    return cntnt.likes;
  }

  findOne(id: number) {
    return this.likesRepository.findOne({
      relations: ['post', 'comment', 'owner', 'post.author', 'comment.author'],
      where: { id },
    });
  }

  async remove(id: number) {
    const like = await this.likesRepository.findOneBy({ id });
    if (!like)
      throw new BadRequestException(`Like with ID: ${id} does not exist!`);
    return this.likesRepository.remove(like);
  }

  saveLike(like: Like) {
    return this.likesRepository.save(like);
  }
}
