import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UserNotFoundException } from 'common/user-not-found.exception';
import { NotFoundException } from '@nestjs/common';
import { UserFollow } from './entities/user-follow.entity';
import { randomUUID } from 'crypto';

const mockUser: User = {
  id: 'user-id-1',
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
      return this.oauthId && this.oauthProvider
  },
  canUsePasswordAuth() {
      return !!this.isOAuthUser()
  },
};

const mockUser2: User = {
  id: 'user-id-2',
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
      return this.oauthId && this.oauthProvider
  },
  canUsePasswordAuth() {
      return !!this.isOAuthUser()
  },
};

const mockUsersService = {
  findAll: jest.fn(),
  findOneByUsername: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  follow: jest.fn(),
  unfollow: jest.fn(),
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: typeof mockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // describe('findAll', () => {
  //   it('should return an array of users', async () => {
  //     const usersArray = [mockUser, mockUser2];
  //     service.findAll.mockResolvedValue(usersArray);

  //     const result = await resolver.findAll();
      
  //     expect(result).toEqual(usersArray);
  //     expect(service.findAll).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe('findOne (by username)', () => {
    it('should return a single user if found', async () => {
      service.findOneByUsername.mockResolvedValue(mockUser);

      const result = await resolver.findOne(mockUser.username);
      
      expect(result).toEqual(mockUser);
      expect(service.findOneByUsername).toHaveBeenCalledWith(mockUser.username);
    });

    it('should throw NotFoundException if user is not found', async () => {
      service.findOneByUsername.mockResolvedValue(null);
      const username = 'nonexistent';

      await expect(resolver.findOne(username)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resolver.findOne(username)).rejects.toThrow(
        `User with Username: ${username} does not exist!`,
      );
      expect(service.findOneByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe('findOneById', () => {
    it('should return a single user if found by ID', async () => {
      service.findOne.mockResolvedValue(mockUser);

      const result = await resolver.findOneById(mockUser.id);
      
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user is not found by ID', async () => {
      service.findOne.mockResolvedValue(null);
      const id = 'nonexistent-id';

      await expect(resolver.findOneById(id)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resolver.findOneById(id)).rejects.toThrow(
        `User with ID: ${id} does not exist!`,
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateInput: UpdateUserInput = { id: mockUser.id, username: 'newusername' };
      const updatedUser = { ...mockUser, ...updateInput };

      service.update.mockResolvedValue(updatedUser);

      const result = await resolver.updateUser(updateInput, mockUser);
      
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(mockUser, updateInput);
    });
  });

  describe('removeUser', () => {
    it('should call the remove service and return its result', async () => {
      const removeResult = `This action removes a #${mockUser.id} user`;
      service.remove.mockResolvedValue(removeResult);

      const result = await resolver.removeUser(mockUser.id);
      
      expect(result).toEqual(removeResult);
      expect(service.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('followUser', () => {
    it('should call the follow service and return the result', async () => {
      const mockFollowRelation = {
        id: randomUUID(),
        follower: mockUser,
        following: mockUser2,
        createdAt: new Date(),
      } as UserFollow;
      
      service.follow.mockResolvedValue(mockFollowRelation);

      const result = await resolver.followUser(mockUser2.id, mockUser);
      
      expect(result).toEqual(mockFollowRelation); 
      expect(service.follow).toHaveBeenCalledWith(mockUser, mockUser2.id);
    });

    it('should catch UserNotFoundException and re-throw NotFoundException', async () => {
      const nonExistentId = 'non-existent-id';
      const errorMessage = "User with ID: " + nonExistentId + " not found!";
      
      service.follow.mockRejectedValue(new UserNotFoundException(nonExistentId));

      await expect(resolver.followUser(nonExistentId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resolver.followUser(nonExistentId, mockUser)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should re-throw other errors', async () => {
      const otherError = new Error('Something else went wrong');
      service.follow.mockRejectedValue(otherError);

      await expect(resolver.followUser(mockUser2.id, mockUser)).rejects.toThrow(
        otherError,
      );
    });
  });

  describe('unFollowUser', () => {
    it('should call the unfollow service and return the result', async () => {
      const unfollowResult = { success: true };
      service.unfollow.mockResolvedValue(unfollowResult);

      const result = await resolver.unFollowUser(mockUser2.id, mockUser);
      
      expect(result).toEqual(unfollowResult);
      expect(service.unfollow).toHaveBeenCalledWith(mockUser, mockUser2.id);
    });

    it('should catch UserNotFoundException (if thrown) and re-throw NotFoundException', async () => {
      // Although the service.unfollow doesn't throw this, we test the resolver's catch block
      const nonExistentId = 'non-existent-id';
      const errorMessage = `User with ID: ${nonExistentId} not found!`;
      
      service.unfollow.mockRejectedValue(new UserNotFoundException(nonExistentId));

      await expect(resolver.unFollowUser(nonExistentId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resolver.unFollowUser(nonExistentId, mockUser)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
