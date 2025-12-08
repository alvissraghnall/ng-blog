import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { Notification } from './entities/notification.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [NotificationsResolver, NotificationsService, ConfigService],
  imports: [TypeOrmModule.forFeature([Notification]), ConfigModule],
})
export class NotificationsModule {}
