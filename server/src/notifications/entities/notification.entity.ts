import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { BaseEntity } from 'common/entities/base.entity';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
}

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Field(() => String)
  @Column()
  message: string;

  @Field(() => Boolean)
  @Column({ default: false })
  read: boolean;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  recipient: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  actor: User;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  resourceId?: number;
}
