import { Factory, runSeeder, Seeder, useSeeding } from 'typeorm-seeding';
import { DataSource } from 'typeorm';

/*
export default class MainSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    console.log('Running main seeder...');

    // await connection.query(
    //   'TRUNCATE TABLE likes, comments, post_tags, posts, tags, users RESTART IDENTITY CASCADE;',
    // );

    const CreateUsers = (await import('../seeds/create-users.seed')).default;
    const CreateTags = (await import('../seeds/create-tags.seed')).default;
    const CreatePosts = (await import('../seeds/create-posts.seed')).default;
    const CreateComments = (await import('../seeds/create-comments.seed'))
      .default;
    const CreateLikes = (await import('../seeds/create-likes.seed')).default;

    const userSeeder = new CreateUsers();
    const tagSeeder = new CreateTags();
    const postSeeder = new CreatePosts();
    const commentSeeder = new CreateComments();
    const likeSeeder = new CreateLikes();

    await userSeeder.run(factory, connection);
    // await tagSeeder.run(factory, connection);
    await postSeeder.run(factory, connection);
    await commentSeeder.run(factory, connection);
    await likeSeeder.run(factory, connection);

    // runSeeder(CreateUsers);

    console.log('Database seeding completed!');
  }
}
*/
