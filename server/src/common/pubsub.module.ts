import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub, PubSubEngine } from 'graphql-subscriptions';

export const PUB_SUB = 'PUB_SUB';

export interface PubSubAdapter extends PubSubEngine {
  asyncIterator<T>(triggers: string | string[]): AsyncIterableIterator<T>;
}

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (redisUrl) {
          return new RedisPubSub({ connection: redisUrl });
        }

        return new PubSub();
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
  imports: [ConfigModule],
})
export class PubSubModule {}