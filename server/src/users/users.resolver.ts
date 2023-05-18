import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'common/current-user.decorator';
import { UserNotFoundException } from 'common/user-not-found.exception';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('username', { type: () => String }) username: string) {
    const user = this.usersService.findOneByUsername(username);
    if(!user) throw new NotFoundException(`User with Username: ${username} does not exist!`);
    return user;
  }

  @Query(() => User, { name: 'getUserById' })
  findOneById (@Args("id", { type: () => String}) id: string) {
    const user = this.usersService.findOne(id);
    if(!user) throw new NotFoundException(`User with ID: ${id} does not exist!`);
    return user;
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput, @CurrentUser() currUser: User) {
    return this.usersService.update(currUser, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => User)
  followUser (@Args('userToBeFollowedId', { type: () => String }) userToBeFollowedId: string, @CurrentUser() currUser) {
    try {
      const updatedUser = this.usersService.follow(currUser, userToBeFollowedId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Mutation(() => User)
  unFollowUser (@Args('userToBeUnfollowedId', { type: () => String }) userToBeUnfollowedId: string, @CurrentUser() currUser) {
    try {
      const updatedUser = this.usersService.unfollow(currUser, userToBeUnfollowedId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }
}
