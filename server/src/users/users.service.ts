import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
    @InjectRepository(UserFollow)
    private readonly userFollowRepository: Repository<UserFollow>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {

    const { avatar, ...userData } = createUserInput;
    
    let avatarUrl: string | undefined;

    // Upload avatar if provided
    if (avatar) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(
          avatar,
          'sharewithlouis/avatars',
        );
        avatarUrl = uploadResult.secure_url;
      } catch (error) {
        throw new BadRequestException(`Failed to upload avatar: ${error.message}`);
      }
    }
    const user = this.usersRepository.create({
      ...userData,
      avatar: avatarUrl,
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

  async linkOAuthProvider(
    userId: string,
    provider: string,
    providerId: string,
  ): Promise<User> {
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

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async update(user: User, updateUserInput: UpdateUserInput) {
    const { avatar, ...userData } = updateUserInput;
    
    let avatarUrl = user.avatar;

    if (avatar) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(
          avatar,
          'sharewithlouis/avatars',
        );
        avatarUrl = uploadResult.secure_url;
      } catch (error) {
        throw new BadRequestException(`Failed to upload avatar: ${error.message}`);
      }
    }

    const updatedUser: Partial<User> = { 
      ...userData, 
      id: user.id,
      avatar: avatarUrl,
    };
    
    return this.usersRepository.save(updatedUser);
  }

  async uploadAvatar(user: User, avatar: FileUpload): Promise<User> {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(
        avatar,
        'sharewithlouis/avatars',
      );
      
      // Update user with new avatar URL
      user.avatar = uploadResult.secure_url;
      return this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException(`Failed to upload avatar: ${error.message}`);
    }
  }

  // async findOneByUsername(username: string): Promise<User | null> {
  //   return this.usersRepository.findOne({
  //     where: { username },
  //   });
  // }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .loadRelationCountAndMap('user.followerCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .getOne();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async findByProviderId(
    providerId: string,
    provider: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { oauthId: providerId, oauthProvider: provider },
    });
  }

  async getByPayload(payload: JwtPayload): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: payload.sub },
    });
  }

  /*
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
  */

  private async generateUniqueUsername(profile: OAuthProfile): Promise<string> {
    const rawBase =
      profile.name?.trim().replace(/\s+/g, '').toLowerCase() ||
      profile.email?.split('@')[0]?.toLowerCase() ||
      `user${profile.id.slice(0, 8)}`;

    const baseUsername = rawBase.replace(/[^a-z0-9_]/g, '') || 'user';

    let username = baseUsername;
    let counter = 1;
    const MAX_ATTEMPTS = 20;

    while (await this.findOneByUsername(username)) {
      if (counter > MAX_ATTEMPTS) {
        const randomSuffix = Math.random().toString(36).slice(2, 6);
        username = `${baseUsername}_${randomSuffix}`;
        break;
      }

      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  async follow(currUser: User, followUserId: string): Promise<User> {
    if (currUser.id === followUserId)
      throw new BadRequestException('You cannot follow yourself.');

    const userToFollow = await this.usersRepository.findOne({
      where: { id: followUserId },
    });
    if (!userToFollow) throw new UserNotFoundException(followUserId);

    const existing = await this.userFollowRepository.findOne({
      where: {
        follower: { id: currUser.id },
        following: { id: followUserId },
      },
    });

    if (!existing) {
      const follow = this.userFollowRepository.create({
        follower: currUser,
        following: userToFollow,
      });
      await this.userFollowRepository.save(follow);
    }

    return userToFollow;
  }

  async unfollow(currUser: User, unfollowUserId: string): Promise<User> {
    const userToUnfollow = await this.usersRepository.findOne({
      where: { id: unfollowUserId },
    });
    if (!userToUnfollow) throw new UserNotFoundException(unfollowUserId);

    await this.userFollowRepository.delete({
      follower: { id: currUser.id },
      following: { id: unfollowUserId },
    });

    return userToUnfollow;
  }

  async getFollowers(
    username: string,
    limit = 20,
    offset = 0,
  ): Promise<User[]> {
    const user = await this.findOneByUsername(username);
    if (!user)
      throw new UserNotFoundException(
        'User with username: ' + username + ' not found',
      );

    const follows = await this.userFollowRepository.find({
      where: { following: { id: user.id } },
      relations: ['follower'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return follows.map((f) => f.follower);
  }

  async getFollowing(
    username: string,
    limit = 20,
    offset = 0,
  ): Promise<User[]> {
    const user = await this.findOneByUsername(username);
    if (!user)
      throw new UserNotFoundException(
        'User with username: ' + username + ' not found',
      );
    const follows = await this.userFollowRepository.find({
      where: { follower: { id: user.id } },
      relations: ['following'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return follows.map((f) => f.following);
  }

  async checkFollowStatus(followerId: string, followingId: string) {
    return this.userFollowRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });
  }
}
