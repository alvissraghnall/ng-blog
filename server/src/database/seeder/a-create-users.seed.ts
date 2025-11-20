import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const regularUsers = await factory(User)().createMany(8);

    const oauthUsers = await factory(User)({ isOAuth: true }).createMany(2);

    const allUsers = [...regularUsers, ...oauthUsers];
    console.log(
      `Created ${allUsers.length} users (${regularUsers.length} regular, ${oauthUsers.length} OAuth)`,
    );

    return allUsers;
  }
}
