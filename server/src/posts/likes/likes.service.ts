import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly dataSource: DataSource
  ) {}

  async create(createLikeInput: CreateLikeInput, user: User) {
    console.log(createLikeInput);
    
    const cmt = createLikeInput.commentId ? await this.dataSource.getRepository(Comment).findOne({ where: { id: createLikeInput.commentId }, relations: ["likes", "likes.owner"] }) : null;
    const post = createLikeInput.postId ? await this.dataSource.getRepository(Post).findOne({ where: {id: createLikeInput.postId}, relations: ["likes", "likes.owner"] }) : null;

    if (!cmt && !post) throw new NotFoundException("Neither comment nor post provided in request");

    const alreadyLiked = post ? post.likes.some(like => like.owner.id === user.id) : cmt.likes.some(like => like.owner.id === user.id);

    if (alreadyLiked) {
      this.likesRepository.remove(post.likes)
      throw new ConflictException(`User has already liked post with ID ${post.id || cmt.id}`);
    }

    const newLike = new Like();
    newLike.comment = cmt;
    newLike.post = post;
    newLike.owner = user;
    return this.likesRepository.save(newLike);
  }

  async find(entityId: number, entity: EntityOwnsLike) {
    console.log(EntityOwnsLike.COMMENT === entity, entity.toString());

    const cntnt = await this.dataSource
      .getRepository<Post | Comment>(entity.toString().toLocaleLowerCase())
      .findOne({
        relations: ["likes"],
        where: { id: entityId }
      });

    console.log(cntnt); 
      
    return cntnt.likes;
  }

  findOne (id: number) {
    return this.likesRepository.findOne({
      relations: ["post", "comment", "owner", "post.author", "comment.author"],
      where: { id }
    });
  }

  async remove(id: number) {
    const like = await this.likesRepository.findOneBy({id});
    if(!like) throw new BadRequestException(`Like with ID: ${id} does not exist!`);
    return this.likesRepository.remove(like);
  }
}
