import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserFollow } from './entities/user-follow.entity';
import { HashService } from '../auth/hash/hash.service';
import { CreateUserInput } from './dto/create-user.input';
import { OAuthProfile } from '../auth/interfaces/oauth-profile.interface';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { UserNotFoundException } from 'common/user-not-found.exception';
import { UpdateUserInput } from './dto/update-user.input';
import { randomUUID } from 'crypto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockHashService = Partial<Record<keyof HashService, jest.Mock>>;

const createMockHashService = (): MockHashService => ({
  hashPassword: jest.fn(),
});

const mockUser: User = {
  id: 'a-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  emailVerified: false,
  avatar: null,
  oauthProvider: null,
  oauthId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOAuthUser() {
    return this.oauthId && this.oauthProvider;
  },
  canUsePasswordAuth() {
    return !!this.isOAuthUser();
  },
};

const mockUser2: User = {
  id: 'b-user-id',
  username: 'otheruser',
  email: 'other@example.com',
  password: 'hashedpassword2',
  emailVerified: false,
  avatar: null,
  oauthProvider: null,
  oauthId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOAuthUser() {
    return this.oauthId && this.oauthProvider;
  },
  canUsePasswordAuth() {
    return !!this.isOAuthUser();
  },
};

const mockCreateUserInput: CreateUserInput = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

const mockOAuthProfile: OAuthProfile = {
  id: 'oauth-123',
  provider: 'google',
  email: 'oauth@google.com',
  name: 'OAuth User',
  picture: 'http://example.com/pic.png',
};

const mockUserFollow: UserFollow = {
  id: randomUUID(),
  follower: mockUser,
  following: mockUser2,
};

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let userFollowRepository: MockRepository<UserFollow>;
  let hashService: MockHashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: getRepositoryToken(UserFollow),
          useValue: createMockRepository<UserFollow>(),
        },
        {
          provide: HashService,
          useValue: createMockHashService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    userFollowRepository = module.get(getRepositoryToken(UserFollow));
    hashService = module.get<HashService>(HashService) as MockHashService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash the password and save a new user', async () => {
      const hashedPassword = 'hashedpassword';
      const createdUser = { ...mockUser, emailVerified: false };

      hashService.hashPassword.mockResolvedValue(hashedPassword);
      usersRepository.create.mockReturnValue(createdUser);
      usersRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(mockCreateUserInput);

      expect(hashService.hashPassword).toHaveBeenCalledWith(
        mockCreateUserInput.password,
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...mockCreateUserInput,
        password: hashedPassword,
        emailVerified: false,
      });
      expect(usersRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('createOAuthUser', () => {
    it('should create an OAuth user with a unique username', async () => {
      const expectedUser = {
        username: 'oauthuser',
        email: mockOAuthProfile.email,
        avatar: mockOAuthProfile.picture,
        oauthProvider: mockOAuthProfile.provider,
        oauthId: mockOAuthProfile.id,
        password: null,
        emailVerified: true,
      };

      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.save.mockResolvedValue(expectedUser as User);

      const result = await service.createOAuthUser(mockOAuthProfile);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'oauthuser' },
      });
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(expectedUser),
      );
      expect(result.username).toEqual('oauthuser');
    });

    it('should generate a unique username if the base username exists', async () => {
      const baseUsername = 'oauthuser';
      const expectedUsername = 'oauthuser1';

      usersRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      usersRepository.save.mockResolvedValue({
        ...mockUser,
        username: expectedUsername,
      });

      const result = await service.createOAuthUser(mockOAuthProfile);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: baseUsername },
      });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: expectedUsername },
      });
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ username: expectedUsername }),
      );
      expect(result.username).toEqual(expectedUsername);
    });

    it('should use email prefix as username if name is not provided', async () => {
      const profileWithoutName = { ...mockOAuthProfile, name: null };
      const expectedUsername = 'oauth';

      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.save.mockResolvedValue({} as User);

      await service.createOAuthUser(profileWithoutName);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: expectedUsername },
      });
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ username: expectedUsername }),
      );
    });

    it('should use user+id as username if name and email are not provided', async () => {
      const profileWithoutNameOrEmail = {
        ...mockOAuthProfile,
        name: null,
        email: null,
      };
      const expectedUsername = 'useroauth12';

      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.save.mockResolvedValue({} as User);

      await service.createOAuthUser(profileWithoutNameOrEmail);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: expectedUsername },
      });
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ username: expectedUsername }),
      );
    });
  });

  describe('linkOAuthProvider', () => {
    it('should update user with OAuth provider info and return the user', async () => {
      const provider = 'github';
      const providerId = 'github-456';
      const updatedUser = {
        ...mockUser,
        oauthProvider: provider,
        oauthId: providerId,
      };

      usersRepository.update.mockResolvedValue(undefined);
      usersRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.linkOAuthProvider(
        mockUser.id,
        provider,
        providerId,
      );

      expect(usersRepository.update).toHaveBeenCalledWith(mockUser.id, {
        oauthProvider: provider,
        oauthId: providerId,
      });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      usersRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOne(mockUser.id);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersArray = [mockUser, mockUser2];
      usersRepository.find.mockResolvedValue(usersArray);
      const result = await service.findAll();
      expect(usersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(usersArray);
    });
  });

  describe('remove', () => {
    it('should return a string indicating removal', async () => {
      const result = await service.remove('1');
      expect(result).toEqual('This action removes a #1 user');
    });
  });

  describe('update', () => {
    it('should save and return the updated user', async () => {
      const updateInput: UpdateUserInput = {
        id: mockUser.id,
        username: 'newusername',
      };
      const updatedUser = { ...mockUser, ...updateInput };

      usersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(mockUser, updateInput);

      expect(usersRepository.save).toHaveBeenCalledWith({
        ...updateInput,
        id: mockUser.id,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('findOneByUsername', () => {
    it('should find a user by username', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOneByUsername(mockUser.username);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: mockUser.username },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOneByEmail(mockUser.email);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByUsernameOrEmail', () => {
    it('should find a user by username or email', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const username = 'testuser';
      const result = await service.findOneByUsernameOrEmail(username);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: username }, { email: username }],
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByProviderId', () => {
    it('should find a user by provider ID and provider name', async () => {
      const provider = 'google';
      const providerId = 'google-123';
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByProviderId(providerId, provider);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { oauthId: providerId, oauthProvider: provider },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getByPayload', () => {
    it('should find a user by JWT payload (sub)', async () => {
      const payload: JwtPayload = {
        sub: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        isOAuth: mockUser.isOAuthUser(),
      };
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getByPayload(payload);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.sub },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('follow', () => {
    it('should allow a user to follow another user', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser2);
      userFollowRepository.findOne.mockResolvedValue(null);
      userFollowRepository.create.mockReturnValue(mockUserFollow);
      userFollowRepository.save.mockResolvedValue(mockUserFollow);

      const result = await service.follow(mockUser, mockUser2.id);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser2.id },
      });
      expect(userFollowRepository.findOne).toHaveBeenCalledWith({
        where: {
          follower: { id: mockUser.id },
          following: { id: mockUser2.id },
        },
      });
      expect(userFollowRepository.create).toHaveBeenCalledWith({
        follower: mockUser,
        following: mockUser2,
      });
      expect(userFollowRepository.save).toHaveBeenCalledWith(mockUserFollow);
      expect(result).toEqual(mockUserFollow);
    });

    it('should throw an error if user tries to follow themselves', async () => {
      await expect(service.follow(mockUser, mockUser.id)).rejects.toThrow(
        'You cannot follow yourself.',
      );
    });

    it('should throw UserNotFoundException if the user to follow does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      await expect(service.follow(mockUser, 'non-existent-id')).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should return the existing follow relationship if user is already following', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser2);
      userFollowRepository.findOne.mockResolvedValue(mockUserFollow);

      const result = await service.follow(mockUser, mockUser2.id);

      expect(userFollowRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(mockUserFollow);
    });
  });

  describe('unfollow', () => {
    it('should allow a user to unfollow another user', async () => {
      userFollowRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.unfollow(mockUser, mockUser2.id);

      expect(userFollowRepository.delete).toHaveBeenCalledWith({
        follower: { id: mockUser.id },
        following: { id: mockUser2.id },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('getFollowers', () => {
    it('should return a list of followers for a user', async () => {
      const follows = [
        {
          follower: mockUser2,
          following: mockUser,
          id: 1,
          createdAt: new Date(),
        },
      ];
      userFollowRepository.find.mockResolvedValue(follows);

      const result = await service.getFollowers(mockUser.id);

      expect(userFollowRepository.find).toHaveBeenCalledWith({
        where: { following: { id: mockUser.id } },
        relations: ['follower'],
      });
      expect(result).toEqual([mockUser2]);
    });
  });

  describe('getFollowing', () => {
    it('should return a list of users a user is following', async () => {
      const follows = [
        {
          follower: mockUser,
          following: mockUser2,
          id: 1,
          createdAt: new Date(),
        },
      ];
      userFollowRepository.find.mockResolvedValue(follows);

      const result = await service.getFollowing(mockUser.id);

      expect(userFollowRepository.find).toHaveBeenCalledWith({
        where: { follower: { id: mockUser.id } },
        relations: ['following'],
      });
      expect(result).toEqual([mockUser2]);
    });
  });
});
