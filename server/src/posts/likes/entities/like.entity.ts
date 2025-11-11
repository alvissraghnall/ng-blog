import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from '../../../posts/comments/entities/comment.entity';
import { Post } from '../../../posts/entities/post.entity';
import { User } from 'users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@Entity()
@Unique(['owner', 'comment'])
@Unique(['owner', 'post'])
export class Like extends BaseEntity {
  @Field(() => Int, { description: 'Likes Collection ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Post, { description: 'Post that was liked', nullable: true })
  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE', // Delete like when post is deleted
  })
  post?: Post;

  @Field(() => Comment, {
    description: 'Comment that was liked',
    nullable: true,
  })
  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: 'CASCADE', // Delete like when comment is deleted
  })
  comment?: Comment;

  @Field(() => User, { description: 'User who liked post.' })
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE', // Delete like when user is deleted
  })
  owner: User;
}
