import { Module } from '@nestjs/common';
import { JwtKeyService } from './jwt-key.service';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  providers: [JwtKeyService, ConfigService],
  exports: [JwtKeyService],
  imports: [ConfigModule],
})
export class JwtKeyModule {}
