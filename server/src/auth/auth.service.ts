import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from "@nestjs/jwt";
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  login(user: User) {

    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id
      }),
      user
    }
  }
  
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService
  ) {}

  async validator () {
    //
  }

  async validateUser(username: string, password: string): Promise<any> {    
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      return user;
    }
    return null;

  }

}
