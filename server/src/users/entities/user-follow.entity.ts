import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity('user_follows')
@Unique(['follower', 'following'])
@ObjectType()
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'User Follow ID' })
  id: string;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  follower: User;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  following: User;
}
