import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: FileUpload,
    folder: string = 'sharewithlouis',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          allowed_formats: ['webp', 'jpg', 'jpeg', 'png'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const stream = file.createReadStream();
      stream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return v2.uploader.destroy(publicId);
  }
}
