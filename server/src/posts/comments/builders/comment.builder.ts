import { User } from 'users/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from 'posts/likes/entities/like.entity';
import { Post } from 'posts/entities/post.entity';

export class CommentBuilder {
  private readonly comment: Comment;

  constructor() {
    this.comment = new Comment();
  }

  withText(text: string): this {
    this.comment.text = text;
    return this;
  }

  withImage(image: string): this {
    this.comment.image = image;
    return this;
  }

  withAuthor(author: User): this {
    this.comment.author = author;
    return this;
  }

  withPost(post: Post): this {
    this.comment.post = post;
    return this;
  }

  withLikes(likes: Array<Like>): this {
    this.comment.likes = likes;
    return this;
  }

  build(): Comment {
    if (!this.comment.author) throw new Error('Author is required');

    return this.comment;
  }
}
