import { InputType, Field, ID } from '@nestjs/graphql';
import { Match } from 'auth/validator/match.validator';
import { User } from '../entities/user.entity';
import { IsAscii, IsEmail, IsOptional, MinLength, Allow } from 'class-validator';
import { IsUnique } from 'common/is-unique';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @Allow()
  id: string;

  @Field(() => String, { description: 'Username', nullable: true })
  @IsOptional()
  @MinLength(3)
  @IsAscii()
  @IsUnique(User, 'username', {
    message: 'username already exists',
  })
  username?: string;

  @Field(() => String, { description: 'User email address', nullable: true })
  @IsOptional()
  @IsEmail()
  @IsUnique(User, 'email', { message: 'email already exists' })
  email?: string;

  @Field(() => String, { description: 'User password', nullable: true })
  @IsOptional()
  @IsAscii()
  @MinLength(8)
  password?: string;

  @Field(() => String, { description: 'User confirm password', nullable: true })
  @IsOptional()
  @IsAscii()
  @MinLength(8)
  @Match<CreateUserInput>('password')
  confirmPassword?: string;

  @Field(() => String, {
    description: 'User display photo (avatar) URL',
    nullable: true,
  })
  @IsOptional()
  avatar?: string;

  @Field(() => String, { description: 'Short user bio', nullable: true })
  @IsOptional()
  bio?: string;
}