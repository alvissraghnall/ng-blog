
import { HashService } from '../auth/hash/hash.service';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(dataSource: DataSource, private readonly hashService: HashService) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    async beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE USER INSERTED: `, event.entity);
        event.entity.password = await this.hashService.hashPassword(event.entity.password);
    }
}
