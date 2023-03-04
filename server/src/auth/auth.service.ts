import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from "@nestjs/jwt";
import { User } from '../users/entities/user.entity';
import { JwtKeyService } from './jwt/jwt-key.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { JwtPayload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {

  private readonly USER_NOT_FOUND = "USER_NOT_FOUND";
  private readonly PASSWORD_MISMATCH = "PASSWORD_MISMATCH";

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id
      }, {
        algorithm: "RS256",
        privateKey: await this.jwtKeyService.getPrivKey(),
      }),
      user
    }
  }
  
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly jwtKeyService: JwtKeyService,
  ) {}

  async validator () {
    //
  }

  async validateUser(username: string, password: string): Promise<User | string> {    
    const user = await this.usersService.findOne(username);
    console.log(user);

    if (!await this.hashService.comparePassword(password, user.password)) {
      return this.PASSWORD_MISMATCH;
    }
    if (user) {
      return user;
    }
    return this.USER_NOT_FOUND;
  }

  async create (createUserInput: CreateUserInput) {
    const existingUser = await this.usersService.findOne(createUserInput.username);

    if(existingUser) throw new ConflictException("User already exists!");

    return this.usersService.create(createUserInput);
  }

  async validateUserByPayload (userPayload: JwtPayload) {
    
    return await this.usersService.getByPayload(userPayload);
  }

}
