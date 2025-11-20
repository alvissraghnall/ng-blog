import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Comment } from '../../posts/comments/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

interface CommentContext {
  post: Post;
  author: User;
}

define(Comment, (x: unknown, context: CommentContext) => {
  const comment = new Comment();
  comment.text = faker.lorem.paragraph(faker.number.int({ min: 1, max: 3 }));
  comment.post = context.post;
  comment.author = context.author;

  return comment;
});
