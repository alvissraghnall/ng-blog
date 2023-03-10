import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../entities/post.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../../users/entities/user.entity';
import { CreateDateColumn, UpdateDateColumn, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Comment {

  constructor(
    text: string,
    author: User,
    post: Post
  ) {
    this.text = text;
    this.author = author;
    this.post = post;
  }

  @Field(() => Int, { description: 'Comment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({})
  text: string;

  @Field(() => Post, { description: "Post that was commented on" })
  @ManyToOne(type => Post, post => post.comments)
  post: Post;

  @Field(() => User, { description: "Author of blog comment" })
  @ManyToOne(type => User, {
    eager: true
  })
  author: User;

  @Field(() => [Like], { description: "Comment likes" })
  @OneToMany(type => Like, like => like.comment, {
    nullable: false,
    eager: true
  })
  likes: Like[];

  @Field(() => Date, { description: "Comment Created Date" })
  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
