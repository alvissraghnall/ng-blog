import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}
  
  async create(createUserInput: CreateUserInput) {
    const { 
      email, 
      password,
      avatar,
      username
   } = createUserInput;
    const newUser = new User(email, username, password, avatar);

    console.log("new user", newUser);
    const savedUser = await this.usersRepository.save(newUser);
    console.log("saved user", savedUser);

    return savedUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async find(id: string) {
    return await this.usersRepository.findOneBy({
      id
    });
  }

  findOne(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async getByPayload ({ sub }: JwtPayload) {
    return await this.find(sub);
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
