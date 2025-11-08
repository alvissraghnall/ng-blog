import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Comment } from '../../../posts/comments/entities/comment.entity';
import { Post } from '../../../posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@Entity()
@InputType('likeEntityInput')
@Unique(['owner', 'comment'])
@Unique(['owner', 'post'])
export class Like extends BaseEntity {
  @Field(() => Int, { description: 'Likes Collection ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Post, { description: 'Post that was liked', nullable: true })
  @ManyToOne((type) => Post, (post) => post.likes)
  post?: Post;

  @Field(() => Comment, {
    description: 'Comment that was liked',
    nullable: true,
  })
  @ManyToOne((type) => Comment, (comment) => comment.likes, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  comment?: Comment;

  @Field(() => User, { description: 'User who liked post.' })
  @ManyToOne((type) => User)
  owner: User;
}
