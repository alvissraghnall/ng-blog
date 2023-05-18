import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserNotFoundException } from 'common/user-not-found.exception';

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
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: {
        followers: true, following: true
      }
    });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      relations: {
        followers: true, following: true
      }
    });
  }

  async getByPayload ({ sub }: JwtPayload) {
    return await this.findOne(sub);
  }

  update(user: User, updateUserInput: UpdateUserInput) {
    const updatedUser: Partial<User> = { ...updateUserInput, id: user.id };

    return this.usersRepository.save(updatedUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async follow (currUser: User, followUserId: string) {
    const userToBeFollowed = await this.usersRepository.findOne({
      where: { id: followUserId }, relations: ['followers'] 
    });

    if (!userToBeFollowed) throw new UserNotFoundException(followUserId);

    currUser.following.push(userToBeFollowed);
    userToBeFollowed.followers.push(currUser);

    this.usersRepository.save(userToBeFollowed);
    return this.usersRepository.save(currUser);
  }

  async unfollow(currUser: User, userToBeUnfollowedId: string) {
    const userToBeUnfollowed = await this.usersRepository.findOne({
      where: { id: userToBeUnfollowedId },
      relations: { followers: true }
    });

    if (!userToBeUnfollowed) throw new UserNotFoundException(userToBeUnfollowedId);

    currUser.following = currUser.following.filter(user => user.id !== userToBeUnfollowed.id);
    userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(user => user.id !== currUser.id);

    this.usersRepository.save(userToBeUnfollowed);
    return this.usersRepository.save(currUser);
  }
}
