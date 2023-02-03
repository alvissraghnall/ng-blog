import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}
  
  create(createUserInput: CreateUserInput) {
    const { 
      email, 
      password,
      avatar,
      username
   } = createUserInput;
    const newUser = new User(email, username, password, avatar);

    const savedUser = this.usersRepository.save(newUser);
    return savedUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
