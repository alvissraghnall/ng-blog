import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Public } from 'common/public.decorator';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/login.response';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'common/current-user.decorator';


@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @Public()
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  login (@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context: any) {
    console.log(context);
    return this.authService.login(context.user);
  }

  @Mutation(() => User)
  @Public()
  signup(@Args('createUserInput') createAuthInput: CreateUserInput) {
    return this.authService.create(createAuthInput);
  }

  @Query(() => String, { name: 'auth' })
  // @UseGuards(JwtAuthGuard)
  findAll() {
    return "God's boy.";
  }

  @Query(() => Boolean, { name: 'checkJwt' })
  checkJwt () {
    return true;
  }

  @Query(() => User, { name: 'whoami' })
  whoami (@CurrentUser() user: User) {
    return user;
  }

//   @Query(() => User, { name: 'auth' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.authService.findOne(id);
//   }
}
