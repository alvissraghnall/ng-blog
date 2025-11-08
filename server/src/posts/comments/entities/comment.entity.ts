import {
  ObjectType,
  Field,
  Int,
  ResolveField,
  InputType,
} from '@nestjs/graphql';
import { Post } from '../../entities/post.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../../users/entities/user.entity';
import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@InputType('commentInputType')
@Entity()
export class Comment extends BaseEntity {
  @Field(() => Int, { description: 'Comment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({})
  text: string;

  @Field(() => Post, { description: 'Post that was commented on' })
  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;

  @Field(() => User, { description: 'Author of blog comment' })
  @ManyToOne((type) => User, {
    // eager: true,
  })
  @JoinColumn()
  author: User;

  @Field(() => [Like], { description: 'Likes on Comment', nullable: true })
  @OneToMany((type) => Like, (like) => like.comment, {
    nullable: true,
  })
  likes: Like[];
}
