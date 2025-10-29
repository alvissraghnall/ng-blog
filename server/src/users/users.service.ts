import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { HashService } from '../auth/hash/hash.service';
import { OAuthProfile } from '../auth/interfaces/oauth-profile.interface';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { UserFollow } from './entities/user-follow.entity';
import { UserNotFoundException } from 'common/user-not-found.exception';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
	@InjectRepository(UserFollow) private readonly userFollowRepository: Repository<UserFollow>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await this.hashService.hashPassword(createUserInput.password);

    const user = this.usersRepository.create({
      ...createUserInput,
      password: hashedPassword,
      emailVerified: false, 
    });

    return this.usersRepository.save(user);
  }

  async createOAuthUser(profile: OAuthProfile): Promise<User> {
    const username = await this.generateUniqueUsername(profile);

    const user = new User();
	  Object.assign(user, {
      username,
      email: profile.email,
      avatar: profile.picture,
      oauthProvider: profile.provider,
      oauthId: profile.id,
      password: null, 
      emailVerified: true, 
    });

    return this.usersRepository.save(user);
  }

  async linkOAuthProvider(userId: string, provider: string, providerId: string): Promise<User> {
    await this.usersRepository.update(userId, {
      oauthProvider: provider,
      oauthId: providerId,
    });

    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async update(user: User, updateUserInput: UpdateUserInput) {
    const updatedUser: Partial<User> = { ...updateUserInput, id: user.id };
    return this.usersRepository.save(updatedUser);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
    });
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [ { username: usernameOrEmail }, { email: usernameOrEmail } ]
    });
  }

  async findByProviderId(providerId: string, provider: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { oauthId: providerId, oauthProvider: provider },
    });
  }

  async getByPayload(payload: JwtPayload): Promise<User> {
    return this.usersRepository.findOne({ 
      where: { id: payload.sub },
    });
  }

  private async generateUniqueUsername(profile: OAuthProfile): Promise<string> {
    const baseUsername = profile.name?.replace(/\s+/g, '').toLowerCase() || 
                        profile.email?.split('@')[0] || 
                        `user${profile.id.slice(0, 8)}`;

    let username = baseUsername;
    let counter = 1;

    while (await this.findOneByUsername(username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  async follow(currUser: User, followUserId: string) {
    if (currUser.id === followUserId)
      throw new Error('You cannot follow yourself.');

    const userToFollow = await this.usersRepository.findOne({ where: { id: followUserId } });
    if (!userToFollow) throw new UserNotFoundException(followUserId);

    const existing = await this.userFollowRepository.findOne({
      where: {
        follower: { id: currUser.id },
        following: { id: followUserId },
      },
    });

    if (existing) return existing;

    const follow = this.userFollowRepository.create({
      follower: currUser,
      following: userToFollow,
    });

    return this.userFollowRepository.save(follow);
  }

  async unfollow(currUser: User, unfollowUserId: string) {
    await this.userFollowRepository.delete({
      follower: { id: currUser.id },
      following: { id: unfollowUserId },
    });

    return { success: true };
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.userFollowRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
    return follows.map(f => f.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.userFollowRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    return follows.map(f => f.following);
  }
}
