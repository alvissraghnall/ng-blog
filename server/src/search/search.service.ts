import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from 'posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { Tag } from 'posts/entities/tag.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagsRepo: Repository<Tag>,
  ) {}

  async searchPosts(
    query: string,
    limit: number,
    offset: number,
  ): Promise<Post[]> {
    return this.postsRepo.find({
      where: [
        { title: ILike(`%${query}%`) },
        { desc: ILike(`%${query}%`) },
        // { content: ILike(`%${query}%`) }
      ],
      relations: ['author', 'tags'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async searchUsers(
    query: string,
    limit: number,
    offset: number,
  ): Promise<User[]> {
    return this.usersRepo.find({
      where: [{ username: ILike(`%${query}%`) }, { bio: ILike(`%${query}%`) }],
      take: limit,
      skip: offset,
    });
  }

  async searchTags(query: string, limit: number): Promise<Tag[]> {
    return this.tagsRepo.find({
      where: { name: ILike(`%${query}%`) },
      take: limit,
    });
  }
}
