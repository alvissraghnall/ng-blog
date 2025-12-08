import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryResolver } from './cloudinary.resolver';

@Module({
  providers: [
    CloudinaryProvider,
    CloudinaryService,
    ConfigService,
    CloudinaryResolver,
  ],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
