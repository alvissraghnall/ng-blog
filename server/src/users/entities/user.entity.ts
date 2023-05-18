import { ObjectType, Field, Int
 } from '@nestjs/graphql';
import { IsUnique } from '../../common/is-unique';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from 'posts/entities/post.entity';
import { Comment } from 'posts/comments/entities/comment.entity';

@ObjectType()
@Entity()
export class User {

  constructor(
    email: string,
    username: string,
    password: string,
    avatar: string,
  ) {
    this.avatar = avatar;
    this.password = password;
    this.email = email;
    this.username = username;
  }

  @Field(() => String, { description: "ID"})
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({
    unique: true,
    length: 255
  })
  username: string;

  @Field()
  @Column({
    unique: true,
    length: 255
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Field({
    nullable: true
  })
  @Column({
    nullable: true
  })
  avatar: string;

  @ManyToOne(type => Post, post => post.likes, {
    nullable: true,
    cascade: true
  })
  postLikes: Post[]

  @ManyToOne(type => Comment, comment => comment.likes, {
    cascade: true
  })
  commentLikes: Comment[]

  @ManyToMany(() => User, user => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, user => user.followers, { cascade: true, nullable: true })
  following: User[];

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true
  })
  bio?: string;

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
