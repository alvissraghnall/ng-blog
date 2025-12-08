import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly MAX_SIZE = 0.44 * 1024 * 1024;
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  async transform(value: Promise<FileUpload>) {
    const file = await value;
    const { mimetype, filename, createReadStream } = file;

    if (!this.ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw new BadRequestException(
        `File type ${mimetype} is not supported. Allowed: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    const originalCreateReadStream = createReadStream;

    file.createReadStream = () => {
      const stream = originalCreateReadStream();
      let byteLength = 0;

      stream.on('data', (chunk) => {
        byteLength += chunk.length;
        if (byteLength > this.MAX_SIZE) {
          stream.destroy();
          throw new BadRequestException(
            `File ${filename} exceeds the size limit of 450kB`,
          );
        }
      });

      return stream;
    };

    return file;
  }
}
