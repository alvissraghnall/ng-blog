import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlJwtAuthGuard as JwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'common/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => [User])
  async followers(@Parent() user: User): Promise<User[]> {
    return this.usersService.getFollowers(user.id);
  }

  @ResolveField(() => [User])
  async following(@Parent() user: User): Promise<User[]> {
    return this.usersService.getFollowing(user.id);
  }

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
  ): Promise<User> {
    return this.usersService.follow(currUser, userToBeFollowedId);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async unFollowUser(
    @Args('userToBeUnfollowedId', { type: () => String })
    userToBeUnfollowedId: string,
    @CurrentUser() currUser: User,
  ): Promise<User> {
    return this.usersService.unfollow(currUser, userToBeUnfollowedId);
  }
}
