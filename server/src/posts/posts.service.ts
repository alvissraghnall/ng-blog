import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtResponsePayload } from 'auth/jwt/jwt-response.payload';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { Category } from './enum/category.enum';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService
  ) {}

  async create(createPostInput: CreatePostInput, user: User) {
    const { title, content, category, desc, image } = createPostInput;
    console.log(user);

    const newPost = new Post(
      title, content, image, desc, category, user
    );

    return await this.postsRepository.save(newPost);
  }

  find(cat?: Category): Promise<Post[]> {
    return cat 
      ? 
      this.postsRepository.find({
        where: { category: cat },
        relations: ["author", "likes", "comments"]
      }) 
      : this.postsRepository.find({
        relations: ["author", "likes", "comments"]
      });
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneBy({ id });
  }

  update(updatePostInput: UpdatePostInput, user: User) {
    const { 
      id,
      title,
      image,
      desc,
      content,
      category
    } = updatePostInput;
    const post = new Post(title, content,  image, desc, category, user);
    post.id = id;
    return this.postsRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postsRepository.findOneBy({id});
    if(!post) throw new NotFoundException("Post with id: " + id + " does not exist, and hence cannot be deleted.");
    return this.postsRepository.remove(post);
  }
}
