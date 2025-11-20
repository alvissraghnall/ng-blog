import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
  Post,
} from "@nestjs/common";
import { Resolver, Mutation, Args, Context, Query } from "@nestjs/graphql";
import { Public } from "common/public.decorator";
import { CreateUserInput } from "../users/dto/create-user.input";
import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { LoginUserInput } from "./dto/login-user.input";
import { LoginResponse } from "./dto/login.response";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { CurrentUser } from "common/current-user.decorator";
import { OAuthInput } from "./dto/oauth.input";
import { OAuthService } from "./oauth/oauth.service";

@Resolver(() => User)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
  ) {}

  @Mutation(() => LoginResponse)
  @Public()
  @UseGuards(GqlAuthGuard)
  login(
    @Args("loginUserInput") loginUserInput: LoginUserInput,
    @Context() context: any,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => LoginResponse)
  @Public()
  async oauthLogin(@Args("oauthInput") oauthInput: OAuthInput) {
    const user = await this.oauthService.authenticate(oauthInput);
    return this.authService.login(user);
  }

  @Mutation(() => String)
  @Public()
  async getOAuthUrl(@Args("provider") provider: string): Promise<string> {
    // Frontend calls this to get the OAuth URL to redirect to
    return this.oauthService.getAuthorizationUrl(provider);
  }

  @Mutation(() => User)
  @Public()
  signup(@Args("createUserInput") createUserInput: CreateUserInput) {
    return this.authService.createPasswordUser(createUserInput);
  }

  @Query(() => String)
  @UseGuards(GqlJwtAuthGuard)
  auth() {
    return "God's boy.";
  }

  @Query(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  checkJwt() {
    return true;
  }

  @Query(() => User)
  @UseGuards(GqlJwtAuthGuard)
  whoami(@CurrentUser() user: User) {
    return user;
  }
}
