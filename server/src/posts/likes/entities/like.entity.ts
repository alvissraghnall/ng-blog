import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from '../../../posts/comments/entities/comment.entity';
import { Post } from '../../../posts/entities/post.entity';
import { User } from '../../../users/entities/user.entity';
import { Column, CreateDateColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class Like {
  @Field(() => Int, { description: "Likes Collection ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    nullable: true
  })
  @ManyToOne(type => Post, post => post.likes)
  post: Post;

  @Field()
  @Column({
    nullable: true
  })
  @ManyToOne(type => Comment)
  comment: Comment; 

  @Field()
  @Column()
  @OneToOne(type => User)
  owner: User;

  

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
