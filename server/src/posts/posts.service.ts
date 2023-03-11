import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtResponsePayload } from 'auth/jwt/jwt-response.payload';
import { v2 } from 'cloudinary';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
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
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createPostInput: CreatePostInput, user: User) {
    const { title, content, category, desc, image } = createPostInput;
    console.log(user);

    const newPost = new Post(
      title, content, image, desc, category, user
    );

    return await this.postsRepository.save(newPost);
  }

  find(cat?: Category, authorId?: string): Promise<Post[]> {
    // return cat 
    //   ? 
    //   this.postsRepository.find({
    //     where: { category: cat },
    //     relations: ["author", "likes", "comments"]
    //   }) 
    //   : ( authorId ?
    //     this.postsRepository.find({
    //       where: { author: { id: authorId } },
    //       relations: ["author", "likes", "comments"]
    //     }) :
    return this.postsRepository.find({
      relations: ["author", "likes", "comments"],
      where: cat && authorId ? { category: cat, author: { id: authorId } } : (
        cat ? { category: cat } : (
          authorId ? { author: { id: authorId } } : undefined
        )
      )
    });
      // );
  }

  // getByAuthorId (id: string): Promise<Post[]> {
  //   return this.postsRepository.find({
  //     where: 
  //   })
  // }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ["author", "likes", "comments", "comments.likes", "likes.owner", "comments.author", "comments.likes.owner", "comments.likes" ]
    });
  }

  async update(updatePostInput: UpdatePostInput, user: User) {
    const { 
      id,
      title,
      image,
      desc,
      content,
      category
    } = updatePostInput;
    const post = new Post(title, content, image, desc, category, user);
    post.id = id;
    return this.postsRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postsRepository.findOneBy({id});
    if(!post) throw new NotFoundException("Post with id: " + id + " does not exist, and hence cannot be deleted.");
    return this.postsRepository.remove(post);
  }
}
