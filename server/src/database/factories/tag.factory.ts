import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Tag } from '../../posts/entities/tag.entity';

define(Tag, () => {
  const tagNames = [
    'JavaScript',
    'TypeScript',
    'NestJS',
    'GraphQL',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'AWS',
    'Testing',
    'Security',
    'Performance',
    'Web Development',
    'Mobile Development',
    'AI/ML',
    'DevOps',
    'UI/UX',
  ];

  const tag = new Tag();
  tag.name = faker.word.noun();

  return tag;
});
