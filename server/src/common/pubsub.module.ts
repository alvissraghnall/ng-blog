import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        return new RedisPubSub({
          connection: configService.getOrThrow<string>('REDIS_URL'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
  imports: [ConfigModule],
})
export class PubSubModule {}
