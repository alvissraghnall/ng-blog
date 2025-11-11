import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from 'common/entities/base.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
@ObjectType()
export class Tag extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ManyToMany((type) => Post, (post) => post.tags)
  @Field((type) => [Post], { nullable: true })
  posts: Post[];
}
