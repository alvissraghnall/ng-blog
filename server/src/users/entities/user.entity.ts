import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsUnique } from '../../common/is-unique';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'common/entities/base.entity';

@ObjectType()
@InputType('userInputType')
@Entity()
export class User extends BaseEntity {
  @Field(() => String, { description: 'ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  @Field(() => String, { nullable: false })
  username: string;

  @Column({ unique: true })
  @Field(() => String, { nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  @Field({
    nullable: true,
    description: 'OAuth2 Provider name, e.g. Google, GitHub..',
  })
  oauthProvider?: string;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'OAuth2 ID' })
  oauthId?: string;

  @Field(() => Boolean, {
    nullable: false,
    defaultValue: false,
    description: 'Email verification status',
  })
  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  bio?: string;

  isOAuthUser(): boolean {
    return !!this.oauthProvider && !!this.oauthId;
  }

  canUsePasswordAuth(): boolean {
    return !!this.password;
  }
}
