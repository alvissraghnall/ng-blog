import { define } from 'typeorm-seeding';
import { Like } from '../../posts/likes/entities/like.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../posts/comments/entities/comment.entity';

interface LikeContext {
  owner: User;
  post?: Post;
  comment?: Comment;
}

define(Like, (_: unknown, context: LikeContext) => {
  const like = new Like();
  like.owner = context.owner;
  like.post = context.post || null;
  like.comment = context.comment || null;

  return like;
});
