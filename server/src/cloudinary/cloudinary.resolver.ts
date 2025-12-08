import {
  Resolver,
  Mutation,
  Args,
  InterfaceType,
  ObjectType,
  Int,
  Field,
} from '@nestjs/graphql';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { FileValidationPipe } from 'common/file-validation.pipe';

@InterfaceType()
export abstract class UploadResult {
  @Field(() => String)
  url: string;

  @Field(() => String)
  filename: string;

  @Field((type) => Int)
  size: number;

  @Field((type) => String)
  mimeType: string;
}

@Resolver()
export class CloudinaryResolver {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Mutation(() => UploadResult)
  @UseGuards(GqlJwtAuthGuard)
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }, FileValidationPipe)
    file: FileUpload,
    @Args('type', { type: () => String }) type: 'avatar' | 'post',
  ) {
    try {
      const result = await this.cloudinary.uploadImage(
        file,
        `sharewithlouis/${type}`,
      );

      return {
        url: result.secure_url,
        filename: result.original_filename,
        size: result.bytes,
        mimeType: result.format,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Upload failed');
    }
  }
}
