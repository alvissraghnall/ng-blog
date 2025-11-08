import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'posts/enum/category.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Like } from '../likes/entities/like.entity';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Field(() => String)
  @Column({ type: 'text' })
  content: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 1000 })
  image: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 500 })
  desc: string;

  @Field(() => Category)
  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @Field(() => User)
  @ManyToOne(() => User, {
    nullable: false,
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Field(() => Int)
  likeCount: number;

  @Field(() => Int)
  commentCount: number;
}
