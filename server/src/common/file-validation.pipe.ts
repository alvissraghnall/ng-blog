import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    console.log(value);
    return value.size < 2500000 && value.mimetype.startsWith("image");
    
  }


}
