import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlJwtAuthGuard as JwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'common/current-user.decorator';
import { UserNotFoundException } from 'common/user-not-found.exception';
import { UserFollow } from './entities/user-follow.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  // taken out cos why are we even fetching all users ??
  // @Query(() => [User], { name: 'users' })
  // @UseGuards(JwtAuthGuard)
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('username', { type: () => String }) username: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user)
      throw new NotFoundException(
        `User with Username: ${username} does not exist!`,
      );
    return user;
  }

  @Query(() => User, { name: 'findUserById' })
  async findOneById(@Args('id', { type: () => String }) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user)
      throw new NotFoundException(`User with ID: ${id} does not exist!`);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currUser: User,
  ) {
    return this.usersService.update(currUser, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Args('userToBeFollowedId', { type: () => String })
    userToBeFollowedId: string,
    @CurrentUser() currUser: User,
  ): Promise<UserFollow> {
    try {
      return await this.usersService.follow(currUser, userToBeFollowedId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async unFollowUser(
    @Args('userToBeUnfollowedId', { type: () => String })
    userToBeUnfollowedId: string,
    @CurrentUser() currUser: User,
  ) {
    try {
      return await this.usersService.unfollow(currUser, userToBeUnfollowedId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }
}
