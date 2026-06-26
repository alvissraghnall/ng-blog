import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { CurrentUser } from 'common/current-user.decorator';
import { GqlJwtAuthGuard } from 'auth/guards/gql-jwt-auth.guard';
import { UsersService } from './users.service';
import { FileValidationPipe } from 'common/file-validation.pipe';
import { BadRequestException, UseGuards } from '@nestjs/common';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Resolver(() => User)
export class UploadResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  @UseGuards(GqlJwtAuthGuard)
  async uploadAvatar(
    @Args('file', { type: () => GraphQLUpload }, FileValidationPipe)
    file: FileUpload,
    @CurrentUser() user: User,
  ): Promise<User> {
    try {
      return await this.usersService.uploadAvatar(user, file);
    } catch (error) {
      throw new BadRequestException(error.message || 'Avatar upload failed');
    }
  }
}