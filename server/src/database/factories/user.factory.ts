import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

define(User, (_: unknown, context: { isOAuth?: boolean } = {}) => {
  const gender = faker.datatype.boolean;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet
    .username({
      firstName,
      lastName,
    })
    .toLowerCase();
  const email = faker.internet
    .email({
      firstName,
      lastName,
    })
    .toLowerCase();

  const user = new User();
  user.username = username;
  user.email = email;
  user.avatar = faker.image.avatar();
  user.bio = faker.lorem.sentence();
  user.emailVerified = faker.datatype.boolean(0.8);

  if (context?.isOAuth) {
    user.oauthProvider = faker.helpers.arrayElement(['google', 'github']);
    user.oauthId = crypto.randomUUID();
    user.password = null;
  } else {
    bcrypt.hash('password123', 10).then((val) => {
      user.password = val;
    });
    user.oauthProvider = null;
    user.oauthId = null;
  }

  return user;
});
