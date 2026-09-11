import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  MinLength,
  IsArray,
  MIN,
  ArrayMaxSize,
  ArrayNotContains,
  IsOptional,
  Matches,
} from 'class-validator';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { Category } from 'posts/enum/category.enum';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Blog post title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @Field(() => String, { description: 'Blog post content' })
  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  @MaxLength(30000)
  content: string;

  @Field(() => GraphQLUpload, {
    description: 'Blog post image',
    nullable: true,
  })
  @IsOptional()
  image?: FileUpload;

  @Field(() => String, { description: 'Blog post short description' })
  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(400)
  desc: string;

  @Field(() => Category, { description: 'Blog post category' })
  @IsEnum(Category, { message: 'Invalid category.' })
  category: Category;

  @Field(() => [String], { description: 'Blog post tags', nullable: true })
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(22, { each: true })
  @Matches(/^[a-zA-Z0-9-]+$/, {
    each: true,
    message: 'Tags can only contain letters, numbers, or dashes',
  })
  @IsOptional()
  tags?: string[];
}
