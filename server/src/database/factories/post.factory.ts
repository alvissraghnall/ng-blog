import { define } from 'typeorm-seeding';
import { Post } from '../../posts/entities/post.entity';
import { Category } from '../../posts/enum/category.enum';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../posts/entities/tag.entity';
import { faker } from '@faker-js/faker';
import util from 'util';

interface PostContext {
  author: User;
  tags?: Tag[];
}

define(Post, (_: unknown, context: PostContext) => {
  util.inspect(context, { depth: null, colors: true });
  // if (!context.author?.id || !context.author || !context.tags)
  //   throw new Error('No context: ' + JSON.stringify(context));
  const categories = Object.values(Category);

  const post = new Post();
  post.title = faker.lorem.sentence(faker.number.int({ min: 5, max: 10 }));
  post.content = faker.lorem.paragraphs(faker.number.int({ min: 3, max: 10 }));
  post.desc = faker.lorem.sentence(faker.number.int({ min: 10, max: 20 }));
  post.image = faker.image.urlPicsumPhotos({
    width: 800,
    height: 500,
    grayscale: true,
  });
  post.category = faker.helpers.arrayElement(categories);
  post.author = context.author;

  if (context.tags) {
    post.tags = faker.helpers.arrayElements(
      context.tags,
      faker.number.int({ min: 1, max: 5 }),
    );
  }

  return post;
});
