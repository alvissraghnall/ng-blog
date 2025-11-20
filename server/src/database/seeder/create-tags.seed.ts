import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Tag } from '../../posts/entities/tag.entity';

export default class CreateTags implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const tags = await factory(Tag)().createMany(10);
    console.log(`Created ${tags.length} tags`);
  }
}
