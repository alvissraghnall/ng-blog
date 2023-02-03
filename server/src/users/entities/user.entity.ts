import { ObjectType, Field, Int
 } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Field(() => String, { description: "ID" } )
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  avatar: string;

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
