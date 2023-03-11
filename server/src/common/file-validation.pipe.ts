import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    console.log(value);
    if(value.size > 1100000 || !value.mimetype.startsWith("image")) throw new BadRequestException("File must be an image, and must not be larger than 1MB");
    return value;
  }


}
