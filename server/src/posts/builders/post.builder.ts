import { Category } from 'posts/enum/category.enum';
import { Post } from '../entities/post.entity';
import { User } from 'users/entities/user.entity';
import { Comment } from 'posts/comments/entities/comment.entity';
import { Like } from 'posts/likes/entities/like.entity';

export class PostBuilder {
  private readonly post: Post;

  constructor() {
    this.post = new Post();
  }

  withTitle(title: string): this {
    this.post.title = title;
    return this;
  }

  withImage(image: string): this {
    this.post.image = image;
    return this;
  }

  withDesc(desc: string): this {
    this.post.desc = desc;
    return this;
  }

  withContent(content: string): this {
    this.post.content = content;
    return this;
  }

  withAuthor(author: User): this {
    this.post.author = author;
    return this;
  }

  withCategory(category: Category): this {
    this.post.category = category;
    return this;
  }

  withComments(comments: Array<Comment>): this {
    this.post.comments = comments;
    return this;
  }

  withLikes(likes: Array<Like>): this {
    this.post.likes = likes;
    return this;
  }

  build(): Post {
    if (!this.post.author) throw new Error('Author is required');

    return this.post;
  }
}
