import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Category } from 'posts/enum/category.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Like } from '../likes/entities/like.entity';
import { BaseEntity } from 'common/entities/base.entity';
import { Tag } from './tag.entity';
import slugify from 'slugify';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Field(() => String)
  @Column({ type: 'text' })
  content: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 1000 })
  image: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 500 })
  desc: string;

  @Field(() => Category)
  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field(() => [Tag], { nullable: true })
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE', // Clean up join table when post deleted
  })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: ['remove'], // Delete comments when post is deleted
  })
  comments: Comment[];

  @HideField()
  @OneToMany(() => Like, (like) => like.post, {
    cascade: ['remove'], // Delete likes when post is deleted
  })
  likes: Like[];

  @Field(() => User)
  @ManyToOne(() => User, {
    nullable: false,
    eager: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Field(() => Int, { defaultValue: 0 })
  likeCount: number = 0;

  @Field(() => Int, { defaultValue: 0 })
  commentCount: number = 0;

  @DeleteDateColumn()
  @Field(() => Date, {
    nullable: false,
    description: 'Date Entity was deleted.',
  })
  deletedAt: Date;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.createSlug(this.title);
    }
  }

  private createSlug(title: string): string {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    return `${baseSlug}-${uniqueSuffix}`;
  }
}
