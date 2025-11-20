import { Seeder, Factory } from 'typeorm-seeding';
import { Connection, DataSource } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../posts/entities/tag.entity';
import { faker } from '@faker-js/faker';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    const users = await connection.getRepository(User).find();
    const tags = await connection.getRepository(Tag).find();

    const posts = [];

    // throw new Error('posts: ' + JSON.stringify(users));

    for (const user of users.slice(15)) {
      const userPosts = await factory(Post)({
        author: user,
        tags: faker.helpers.arrayElements(tags, 4),
      }).createMany(2);
      posts.push(...userPosts);
    }

    console.log(`Created ${posts.length} posts`);
    return posts;
  }
}
