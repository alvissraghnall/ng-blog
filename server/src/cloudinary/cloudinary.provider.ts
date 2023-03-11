import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.constant';


export const CloudinaryProvider: Provider<any> = {
    provide: CLOUDINARY,
    useFactory: (configService: ConfigService) => v2.config({
        cloud_name: configService.get("CLOUDINARY_CLOUD_NAME"),
        api_key: configService.get("CLOUDINARY_API_KEY"),
        api_secret: configService.get("CLOUDINARY_API_SECRET")
    }),
    inject: [ConfigService]
}
