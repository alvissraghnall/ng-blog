import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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

  @Field(() => String, { description: 'Blog post image', nullable: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  image: string;

  @Field(() => String, { description: 'Blog post description', nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  desc: string;

  @Field(() => Category, { description: 'Blog post content', nullable: true })
  @IsOptional()
  @IsEnum(Category)
  category: Category;
}
