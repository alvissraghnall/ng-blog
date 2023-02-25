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

  async validateUser(username: string, password: string): Promise<any> {    
    const user = await this.usersService.findOne(username);
    console.log(user);

    if (user && await this.hashService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
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
