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
    console.log(`BEFORE USER INSERTED: `, event.entity);
    const newPwd = await this.hashService.hashPassword(password);
    event.entity.password = newPwd;
    console.log(`PASSWORD NOW: `, event.entity);
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (
      event.entity &&
      event.entity.password &&
      event.updatedColumns.some((col) => col.propertyName === 'password')
    ) {
      console.log(`BEFORE USER updaTED: `, event.entity);
      event.entity.password = await this.hashService.hashPassword(
        event.entity.password,
      );
      console.log(`PASSWORD NOW: `, event.entity);
    }
  }
}
