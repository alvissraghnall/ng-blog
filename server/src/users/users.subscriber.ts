import { HashService } from '../auth/hash/hash.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private readonly hashService: HashService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { password } = event.entity;

    if (!password) return;
    console.log(`BEFORE USER INSERTED: `, event.entity);

    event.entity.password = await this.hashService.hashPassword(password);
    console.log(`PASSWORD NOW: `, event.entity);
  }

  // async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
  //   if (
  //     event.entity &&
  //     event.entity.password &&
  //     event.updatedColumns.some((col) => col.propertyName === 'password')
  //   ) {
  //     if (!event.entity.password) return;

  //     event.entity.password = await this.hashService.hashPassword(
  //       event.entity.password,
  //     );
  //   }
  // }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (!event.entity || !event.databaseEntity) return;

    const newPassword = event.entity.password;
    const oldPassword = event.databaseEntity.password;

    if (newPassword && newPassword !== oldPassword) {
      event.entity.password = await this.hashService.hashPassword(newPassword);
    }
  }
}
