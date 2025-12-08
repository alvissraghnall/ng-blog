import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { CurrentUser } from 'common/current-user.decorator';
import { User } from 'users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import {
  NOTIFICATION_ADDED_EVENT,
  NotificationsService,
} from './notifications.service';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ConfigService } from '@nestjs/config';
import { PUB_SUB } from 'common/pubsub.module';

@Resolver(() => Notification)
@UseGuards(GqlJwtAuthGuard)
export class NotificationsResolver {
  constructor(
    private readonly service: NotificationsService,
    private readonly configService: ConfigService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => [Notification], { name: 'notifications' })
  @UseGuards(GqlJwtAuthGuard)
  async getNotifications(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ) {
    return this.service.findAll(user.id, limit, offset);
  }

  @Subscription(() => Notification, {
    name: NOTIFICATION_ADDED_EVENT,

    filter: (payload, variables, context) => {
      const userId = context.req?.user?.id || context.user?.id;
      return payload.notificationAdded.recipient.id === userId;
    },
    resolve: (payload) => payload.notificationAdded,
  })
  subscribeToNotifications() {
    return this.pubSub.asyncIterator(NOTIFICATION_ADDED_EVENT);
  }

  @Query(() => Int, { name: 'unreadNotificationsCount' })
  getUnreadCount(@CurrentUser() user: User) {
    return this.service.countUnread(user.id);
  }

  @Mutation(() => Notification)
  markNotificationAsRead(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.service.markAsRead(id, user.id);
  }

  @Mutation(() => Boolean)
  markAllNotificationsAsRead(@CurrentUser() user: User) {
    return this.service.markAllAsRead(user.id);
  }

  // @Mutation(() => Boolean)
  // deleteNotification(
  //   @Args('id', { type: () => String }) id: string,
  //   @CurrentUser() user: User,
  // ) {
  //   return this.service.remove(id, user.id);
  // }
}
