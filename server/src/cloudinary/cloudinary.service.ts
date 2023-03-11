import { Injectable, GatewayTimeoutException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';
import * as cloudinary from "cloudinary";
import { Duplex, Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {

    constructor(
        private readonly configService: ConfigService
    ) {}

    async uploadImage (
        file: Express.Multer.File
    ): Promise<UploadApiErrorResponse | UploadApiResponse> {
        console.log(this.configService.get('CLOUDINARY_API_KEY'));
        
        const stream = new Duplex();
        stream.push(file.buffer);
        stream.push(null);
        
        return new Promise((resolve, reject) => {
            const upload = cloudinary.v2.uploader.upload_stream({
                folder: "ng-blog",
                resource_type: "image",
            }, (error, response) => {
                if(error) {
                    console.error(error);
                    reject(error);
                    throw new GatewayTimeoutException();
                };
                resolve(response);
            });
            console.log(stream);
            stream.pipe(upload);
        })
    }
}
