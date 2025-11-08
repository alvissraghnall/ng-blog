import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('user_follows')
@Unique(['follower', 'following'])
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  follower: User;

  @ManyToOne(() => User, { eager: true })
  following: User;
}
