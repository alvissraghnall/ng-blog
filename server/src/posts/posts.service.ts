import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtResponsePayload } from 'auth/jwt/jwt-response.payload';
import { v2 } from 'cloudinary';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { Category } from './enum/category.enum';
import { PostBuilder } from './builders/post.builder';
import { Tag } from './entities/tag.entity';
import { TagBuilder } from './builders/tag.builder';

export interface FindPostsOptions {
  category?: Category;
  authorId?: string;
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createPostInput: CreatePostInput, user: User): Promise<Post> {
    const { title, content, category, desc, image, tags } = createPostInput;

    let allTags: Tag[];

    if (tags && tags.length > 0) {
      const normalizedTagNames = tags.map((tag) => tag.trim().toLowerCase());

      const existingTags = await this.tagsRepository.find({
        where: normalizedTagNames.map((name) => ({ name })),
      });

      const existingTagNames = existingTags.map((tag) => tag.name);

      const newTagNames = normalizedTagNames.filter(
        (name) => !existingTagNames.includes(name),
      );

      const newTags = newTagNames.map((name) =>
        new TagBuilder().withName(name).build(),
      );

      const savedNewTags = await this.tagsRepository.save(newTags);

      allTags = [...existingTags, ...savedNewTags];
    }

    const newPost = new PostBuilder()
      .withAuthor(user)
      .withTitle(title.trim())
      .withContent(content)
      .withImage(image)
      .withDesc(desc?.trim() || '')
      .withCategory(category)
      .withTags(allTags || [])
      .build();

    return await this.postsRepository.save(newPost);
  }

  async findAll(options: FindPostsOptions = {}): Promise<Post[]> {
    const {
      category,
      authorId,
      includeRelations = true,
      limit,
      offset,
    } = options;

    const where: FindOptionsWhere<Post> = {};

    if (category) {
      where.category = category;
    }

    if (authorId) {
      where.author = { id: authorId };
    }

    const queryOptions: any = {
      where: Object.keys(where).length > 0 ? where : undefined,
      order: { createdAt: 'DESC' },
    };

    if (includeRelations) {
      queryOptions.relations = [
        'author',
        'likes',
        'tags',
        'likes.owner',
        'comments',
        'comments.author',
      ];
    }

    if (limit) {
      queryOptions.take = limit;
    }

    if (offset) {
      queryOptions.skip = offset;
    }

    return this.postsRepository.find(queryOptions);
  }

  async findOne(id: number, includeRelations = true): Promise<Post> {
    const queryOptions: FindOneOptions<Post> = {
      where: { id },
    };

    if (includeRelations) {
      queryOptions.relations = [
        'author',
        'likes',
        'likes.owner',
        'tags',
        'comments',
        'comments.author',
        'comments.likes',
      ];
    }

    const post = await this.postsRepository.findOne(queryOptions);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async findByAuthor(authorId: string, limit?: number): Promise<Post[]> {
    return this.findAll({
      authorId,
      includeRelations: true,
      limit,
    });
  }

  async findByCategory(category: Category, limit?: number): Promise<Post[]> {
    return this.findAll({
      category,
      includeRelations: true,
      limit,
    });
  }

  async update(
    updatePostInput: UpdatePostInput,
    user: User,
    existingPost: Post,
  ): Promise<Post> {
    const { id, title, image, desc, content, category, tags } = updatePostInput;

    let updatedTags = existingPost.tags;

    if (tags && tags.length > 0) {
      const normalizedTagNames = tags.map((tag) => tag.trim().toLowerCase());

      const existingTags = await this.tagsRepository.find({
        where: normalizedTagNames.map((name) => ({ name })),
      });

      const existingTagNames = existingTags.map((tag) => tag.name);

      const newTagNames = normalizedTagNames.filter(
        (name) => !existingTagNames.includes(name),
      );

      const newTags = newTagNames.map((name) =>
        new TagBuilder().withName(name).build(),
      );
      const savedNewTags = newTags.length
        ? await this.tagsRepository.save(newTags)
        : [];

      updatedTags = [...existingTags, ...savedNewTags];
    }

    const updatedPost = new PostBuilder()
      .withAuthor(existingPost.author)
      .withTitle(title ?? existingPost.title)
      .withContent(content ?? existingPost.content)
      .withImage(image ?? existingPost.image)
      .withDesc(desc ?? existingPost.desc)
      .withCategory(category ?? existingPost.category)
      .withTags(updatedTags)
      .build();

    updatedPost.id = id;

    return await this.postsRepository.save(updatedPost);
  }

  async remove(id: number, post: Post): Promise<Post> {
    // const post = await this.findOne(id, false);

    // if (post.author.id !== user.id) {
    //   throw new BadRequestException('You can only delete your own posts');
    // }

    if (post.image) {
      try {
        // await this.cloudinaryService.deleteImage(publicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    const removed = await this.postsRepository.softRemove(post);
    return { ...removed, id };
  }

  async getPostCount(
    options: { category?: Category; authorId?: string } = {},
  ): Promise<number> {
    const where: FindOptionsWhere<Post> = {};

    if (options.category) {
      where.category = options.category;
    }

    if (options.authorId) {
      where.author = { id: options.authorId };
    }

    return this.postsRepository.count({
      where: Object.keys(where).length > 0 ? where : undefined,
    });
  }

  async getPopularPosts(limit: number = 10): Promise<Post[]> {
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoin('post.likes', 'likes')
      .leftJoinAndSelect('post.comments', 'comments')
      .groupBy('post.id')
      .addGroupBy('author.id')
      .addGroupBy('comments.id')
      .orderBy('COUNT(likes.id)', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return posts;
  }

  async getRecentPosts(limit: number = 10): Promise<Post[]> {
    return this.findAll({
      includeRelations: true,
      limit,
    });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.postsRepository.count({ where: { id } });
    return count > 0;
  }

  // async update(updatePostInput: UpdatePostInput, user: User) {
  //   const { id, title, image, desc, content, category } = updatePostInput;
  //   const post = new PostBuilder()
  //     .withAuthor(user)
  //     .withTitle(title)
  //     .withContent(content)
  //     .withImage(image)
  //     .withDesc(desc)
  //     .withCategory(category)
  //     .build();
  //   post.id = id;
  //   return this.postsRepository.save(post);
  // }
}
