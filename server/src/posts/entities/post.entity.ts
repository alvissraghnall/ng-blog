import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'posts/enum/category.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Like } from '../likes/entities/like.entity';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int, { description: 'Blog Post ID' })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String, { description: 'Blog Post Title' })
  @Column({})
  title: string;

  @Field(() => String, { description: 'Blog post content' })
  @Column()
  content: string;

  @Field(() => String, { description: 'Blog post image' })
  @Column()
  image: string;

  @Field(() => String, { description: 'Blog post description' })
  @Column()
  desc: string;

  @Field(() => String, { description: 'Blog post content' })
  @Column({ enum: Category })
  category: Category;

  @Field(() => [Comment], { description: 'Comments on post', nullable: true })
  @OneToMany((type) => Comment, (comment) => comment.post, {
    nullable: true,
  })
  comments: Comment[];

  @Field(() => [Like], { description: 'Likes on post', nullable: true })
  @OneToMany((type) => Like, (like) => like.post, {
    nullable: true,
  })
  likes: Like[];

  @Field(() => User, { description: 'Owner of post', nullable: false })
  @ManyToOne((type) => User, (user) => user.id, {
    nullable: false,
    cascade: true,
    eager: true,
  })
  author: User;
}
