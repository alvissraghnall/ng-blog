import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BaseEntity {
  id: string | number;

  @CreateDateColumn()
  @Field(() => Date, {
    nullable: false,
    description: 'Date Entity was created.',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, {
    nullable: false,
    description: 'Date Entity was last updated.',
  })
  updatedAt: Date;
}
