import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Category } from 'posts/enum/category.enum';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => Int, { description: 'Post id to be updated.' })
  @IsNumber()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @Field(() => Category, {
    description: 'Blog post content category',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @Field(() => String, { description: 'Blog post content', nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(100)
  @MaxLength(30000)
  content?: string;

  @Field(() => String, { description: 'Blog post image URL', nullable: true })
  @IsString()
  @IsUrl()
  @IsOptional()
  @MaxLength(1000)
  image?: string;

  @Field(() => String, {
    description: 'Blog post short description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(30)
  @MaxLength(400)
  desc?: string;

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
