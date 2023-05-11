import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'posts/entities/post.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    private readonly dataSource: DataSource
  ) {}

  async create(createCommentInput: CreateCommentInput, author: User): Promise<Comment> {
    const post = await this.dataSource.getRepository(Post)
      .findOneBy({ id: createCommentInput.postId });
    
    if(!post) throw new BadRequestException("Post with ID: " + createCommentInput.postId + " does not exist!");

    const newComment = new Comment(
      createCommentInput.text,
      author,
      post
    );
    return this.commentsRepository.save(newComment);
  }

  findAllOnPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ["post", "author", "likes"]
    });
  }

  findOne(id: number) {
    return this.commentsRepository.findOneBy({id});
  }

  async update(updateCommentInput: UpdateCommentInput): Promise<Comment> {
    const cmt = await this.commentsRepository.preload(updateCommentInput);
    if(!cmt) throw new BadRequestException(`Comment with ID: ${updateCommentInput.id} does not exist!`);

    return this.commentsRepository.save(cmt);
  }

  async remove(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({id});
    return this.commentsRepository.remove(comment);
  }

  add (comment: Comment) {
    return this.commentsRepository.save(comment);
  }
}
