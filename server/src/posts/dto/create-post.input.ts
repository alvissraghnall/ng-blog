import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlphanumeric, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Category } from 'posts/enum/category.enum';
import { User } from 'users/entities/user.entity';

@InputType()
export class CreatePostInput {

  @Field(() => String, { description: 'Blog post title' })
  @IsNotEmpty()
  title: string;

  @Field(() => String, { description: 'Blog post content' })
  @IsNotEmpty()
  content: string;

  @Field(() => String, { description: "Blog post image"})
  @IsNotEmpty()
  image: string;

  @Field(() => String, { description: "Blog post description"})
  @IsNotEmpty()
  desc: string;

  @Field(() => Category, { description: "Blog post content"})
  @IsEnum(Category)
  category: Category;

  // @Field(() => String, { description: "Owner of posts", nullable: false })
  // @IsUUID()
  // author: string;
}
