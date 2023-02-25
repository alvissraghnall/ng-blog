import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'posts/enum/category.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Comment } from "../comments/entities/comment.entity";
import { Like } from '../likes/entities/like.entity';

@ObjectType()
@Entity()
export class Post {

  constructor(
    title: string,
    content: string,
    image: string,
    desc: string,
    category: Category,
    author: User
  ){
    this.title = title;
    this.content = content;
    this.image = image;
    this.desc = desc;
    this.category = category;
    this.author = author;
  }

  @Field(() => Int, { description: 'Blog Post ID' })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String, { description: 'Blog Post Title' })
  @Column({  })
  title: string;

  @Field(() => String, { description: "Blog post content"})
  @Column()
  content: string;

  @Field(() => String, { description: "Blog post image"})
  @Column()
  image: string;

  @Field(() => String, { description: "Blog post description"})
  @Column()
  desc: string;

  @Field(() => String, { description: "Blog post content"})
  @Column({ enum: Category })
  category: Category;

  @Field(() => [Comment], { description: "Comments on post"})
  @OneToMany(type => Comment, comment => comment.post, {
    nullable: true
  })
  comments: Comment[];

  @Field(() => [Like], { description: "Likes on post"})
  @OneToMany(type => Like, like => like.post, {
    nullable: true
  })
  likes: Like[];

  @Field(() => User, { description: "Owner of posts", nullable: false })
  @ManyToOne(type => User, user => user.id, {
    nullable: false
  })
  author: User;  

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;

}
