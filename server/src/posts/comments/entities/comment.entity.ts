import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../entities/post.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../../users/entities/user.entity';
import { CreateDateColumn, UpdateDateColumn, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({})
  text: string;

  @Field(() => Post, { description: "Post that was commented on" })
  @ManyToOne(type => Post, post => post.comments)
  post: Post;

  @Field(() => String, { description: "Author of blog comment" })
  @OneToOne(type => User)
  author: User;

  @Field(() => [Like], { description: "Comment likes" })
  @OneToMany(type => Like, like => like.comment, {
    nullable: false
  })
  Likes: Like[];

  

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
