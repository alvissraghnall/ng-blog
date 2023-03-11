import { Injectable, GatewayTimeoutException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';
import * as cloudinary from "cloudinary";
import { Readable } from 'stream';
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
        
        const stream = new Readable({
            read() {
                this.push(file.buffer)
            }
        });
        
        return new Promise((resolve, reject) => {
            const upload = cloudinary.v2.uploader.upload_stream((error, response) => {
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
