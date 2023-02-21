import { ObjectType, Field, Int
 } from '@nestjs/graphql';
import { IsUnique } from '../../common/is-unique';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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

  @Field()
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

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
