import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from './is-unique';
import { PubSubModule } from './pubsub.module';

@Module({
  imports: [TypeOrmModule, PubSubModule],
  providers: [IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class CommonModule {}
