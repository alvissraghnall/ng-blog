import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from '../../../posts/comments/entities/comment.entity';
import { Post } from '../../../posts/entities/post.entity';
import { User } from '../../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Like {
  @Field(() => Int, { description: "Likes Collection ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Post, { description: "Post that was liked", nullable: true })
  @ManyToOne(type => Post, post => post.likes)
  post?: Post;

  @Field(() => Comment, { description: "Comment that was liked", nullable: true })
  @ManyToOne(type => Comment, comment => comment.likes, {
    cascade: true,
    onUpdate: 'CASCADE'
  })
  @JoinColumn()
  comment?: Comment; 

  @Field()
  @ManyToOne(type => User)
  owner: User;
  

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
