import { Seeder, Factory } from 'typeorm-seeding';
import { Connection, DataSource } from 'typeorm';
import { Like } from '../../posts/likes/entities/like.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../posts/comments/entities/comment.entity';

export default class CreateLikes implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    const users = await connection.getRepository(User).find();
    const posts = await connection.getRepository(Post).find();
    const comments = await connection.getRepository(Comment).find();

    const likes = [];

    // (70% of likes)
    const postLikeCount = Math.floor(users.length * posts.length * 0.3);
    for (let i = 0; i < postLikeCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const post = posts[Math.floor(Math.random() * posts.length)];

      const existingLike = await connection.getRepository(Like).findOne({
        where: {
          owner: {
            id: user.id,
          },
          post: {
            id: post.id,
          },
        },
      });

      if (!existingLike) {
        const like = await factory(Like)({ owner: user, post }).create();
        likes.push(like);
      }
    }

    // Create likes for comments (30% of likes)
    const commentLikeCount = Math.floor(users.length * comments.length * 0.1);
    for (let i = 0; i < commentLikeCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const comment = comments[Math.floor(Math.random() * comments.length)];

      const existingLike = await connection.getRepository(Like).findOne({
        where: {
          owner: {
            id: user.id,
          },
          comment: {
            id: comment.id,
          },
        },
      });

      if (!existingLike) {
        const like = await factory(Like)({ owner: user, comment }).create();
        likes.push(like);
      }
    }

    console.log(`Created ${likes.length} likes`);
    return likes;
  }
}
