import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/login.response';
import { GqlAuthGuard } from './guards/gql-auth.guard';


@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login (@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context: any) {
    return this.authService.login(context.user);
  }

//   @Mutation(() => User)
//   createAuth(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
//     return this.authService.create(createAuthInput);
//   }

//   @Query(() => [User], { name: 'auth' })
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Query(() => User, { name: 'auth' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.authService.findOne(id);
//   }

//   @Mutation(() => Auth)
//   updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
//     return this.authService.update(updateAuthInput.id, updateAuthInput);
//   }

//   @Mutation(() => Auth)
//   removeAuth(@Args('id', { type: () => Int }) id: number) {
//     return this.authService.remove(id);
//   }
}
