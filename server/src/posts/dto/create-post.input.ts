import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  MinLength,
} from 'class-validator';
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

  @Field(() => String, { description: 'Blog post image URL' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1000)
  image: string;

  @Field(() => String, { description: 'Blog post short description' })
  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(400)
  desc: string;

  @Field(() => Category, { description: 'Blog post category' })
  @IsEnum(Category, { message: 'Invalid category.' })
  category: Category;
}
