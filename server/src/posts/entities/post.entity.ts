import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Comment } from "../comments/entities/comment.entity";
import { Like } from '../likes/entities/like.entity';

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int, { description: 'Blog Post ID' })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String, { description: 'Blog Post Title' })
  @Column({

  })
  title: string;

  @Field()
  @OneToMany(type => Comment, comment => comment.post, {
    nullable: false
  })
  comments: Comment[];

  @Field()
  @OneToMany(type => Like, like => like.post, {
    nullable: false
  })
  likes: Like[];


  

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;

}
