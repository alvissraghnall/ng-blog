import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Comment } from '../../posts/comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

export default class CreateComments implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection.getRepository(User).find();
    const posts = await connection.getRepository(Post).find();

    const comments = [];

    for (const post of posts) {
      console.log(post);
      const commentCount = Math.floor(Math.random() * 3) + 3; // 3-5 comments per post

      for (let i = 0; i < commentCount; i++) {
        const author = users[Math.floor(Math.random() * users.length)];
        const comment = await factory(Comment)({ post, author }).create();
        comments.push(comment);
      }
    }

    console.log(`Created ${comments.length} comments`);
    return comments;
  }
}
