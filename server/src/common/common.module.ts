import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from './is-unique';

@Module({
  imports: [TypeOrmModule],
  providers: [IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class CommonModule {}
