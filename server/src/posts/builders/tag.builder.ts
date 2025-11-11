import { Category } from 'posts/enum/category.enum';
import { User } from 'users/entities/user.entity';
import { Comment } from 'posts/comments/entities/comment.entity';
import { Like } from 'posts/likes/entities/like.entity';
import { Tag } from 'posts/entities/tag.entity';
import { Post } from 'posts/entities/post.entity';

export class TagBuilder {
  private readonly tag: Tag;

  constructor() {
    this.tag = new Tag();
  }

  withName(name: string): this {
    this.tag.name = name;
    return this;
  }

  withPosts(posts: Array<Post>): this {
    this.tag.posts = posts;
    return this;
  }

  build(): Tag {
    if (!this.tag.name) throw new Error('Name is required');

    return this.tag;
  }
}
