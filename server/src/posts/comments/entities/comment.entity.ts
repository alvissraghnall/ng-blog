import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../entities/post.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => Int, { description: 'Comment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @Field(() => Post, { description: 'Post that was commented on' })
  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE', // Delete comment when post is deleted
  })
  post: Post;

  @Field(() => User, { description: 'Author of blog comment' })
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT', // Prevent deleting user if they have comments
  })
  @JoinColumn()
  author: User;

  @Field(() => [Like], { description: 'Likes on Comment', nullable: true })
  @OneToMany(() => Like, (like) => like.comment, {
    cascade: ['remove'], // Delete likes when comment is deleted
    nullable: true,
  })
  likes: Like[];
}
