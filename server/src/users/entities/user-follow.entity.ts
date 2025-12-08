import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from 'common/entities/base.entity';

@Entity('user_follows')
@Unique(['follower', 'following'])
@ObjectType()
export class UserFollow extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'User Follow ID' })
  id: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  follower: User;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  following: User;
}
