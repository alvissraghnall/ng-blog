import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from 'users/entities/user.entity';
import { PubSubEngine } from 'graphql-subscriptions';
import { PubSubAdapter } from 'common/pubsub.module';
import { PUB_SUB } from 'common/pubsub.module';

export const NOTIFICATION_ADDED_EVENT = 'notificationAdded';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    @Inject(PUB_SUB) private readonly pubSub: PubSubAdapter,
  ) {}

  async create(
    recipient: User,
    actor: User,
    type: NotificationType,
    message: string,
    resourceId?: number,
  ) {
    if (recipient.id === actor.id) return;

    const notif = this.repo.create({
      recipient,
      actor,
      type,
      message,
      resourceId,
    });

    const saved = await this.repo.save(notif);

    await this.pubSub.publish(NOTIFICATION_ADDED_EVENT, {
      notificationAdded: saved,
    });

    return saved;
  }

  async findAll(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<Notification[]> {
    return this.repo.find({
      where: { recipient: { id: userId } },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.repo.count({
      where: {
        recipient: { id: userId },
        read: false,
      },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notif = await this.repo.findOne({
      where: { id, recipient: { id: userId } },
    });

    if (!notif) throw new NotFoundException('Notification not found');

    notif.read = true;
    return this.repo.save(notif);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    await this.repo.update(
      { recipient: { id: userId }, read: false },
      { read: true },
    );
    return true;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.repo.delete({ id, recipient: { id: userId } });
    return result.affected > 0;
  }
}
