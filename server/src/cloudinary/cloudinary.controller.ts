import { Body, Controller, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'common/file-validation.pipe';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {

    constructor (
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile (@Body() body: any, @UploadedFile(
        FileValidationPipe
    ) file: Express.Multer.File) {
        console.log(body);
        const res = await this.cloudinaryService.uploadImage(file);
        console.log(res);
        return {
            url: res.url
        };
    }
}
