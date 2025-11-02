import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { JwtKeyService } from './jwt/jwt-key.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { JwtPayload } from './jwt/jwt.payload';
import { OAuthProfile } from './interfaces/oauth-profile.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly jwtKeyService: JwtKeyService,
  ) {}

  async login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      email: user.email,
      isOAuth: user.isOAuthUser(),
    };

    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: 'RS256',
        privateKey: await this.jwtKeyService.getPrivKey(),
      }),
      user,
    };
  }

  async validatePasswordUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    if (user.isOAuthUser() && !user.canUsePasswordAuth()) {
      throw new UnauthorizedException('Please use OAuth to sign in');
    }

    if (!(await this.hashService.comparePassword(password, user.password))) {
      throw new BadRequestException('Invalid password!');
    }

    return user;
  }

  async createPasswordUser(createUserInput: CreateUserInput): Promise<User> {
    const existingUser = await this.usersService.findOneByUsername(
      createUserInput.username,
    );

    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    if (createUserInput.email) {
      const existingEmail = await this.usersService.findOneByEmail(
        createUserInput.email,
      );
      if (existingEmail) {
        throw new ConflictException('Email already registered!');
      }
    }

    return this.usersService.create(createUserInput);
  }

  async validateOAuthLogin(profile: OAuthProfile): Promise<User> {
    try {
      let user = await this.usersService.findByProviderId(
        profile.id,
        profile.provider,
      );

      if (!user && profile.email) {
        user = await this.usersService.findOneByEmail(profile.email);

        if (user && !user.isOAuthUser()) {
          user = await this.usersService.linkOAuthProvider(
            user.id,
            profile.provider,
            profile.id,
          );
          this.logger.log(
            `Linked existing user ${user.id} with ${profile.provider}`,
          );
        }
      }

      if (!user) {
        user = await this.usersService.createOAuthUser(profile);
        this.logger.log(
          `Created new OAuth user for ${profile.provider}: ${profile.email}`,
        );
      }

      return user;
    } catch (error) {
      this.logger.error(
        `OAuth validation failed for ${profile.provider}:`,
        error,
      );
      throw new BadRequestException(`OAuth login failed: ${error.message}`);
    }
  }

  async validateUserByPayload(userPayload: JwtPayload): Promise<User> {
    return await this.usersService.getByPayload(userPayload);
  }
}
