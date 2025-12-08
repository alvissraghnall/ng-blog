import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFollow } from './entities/user-follow.entity';
import {
  createIsFollowingLoader,
  IsFollowingLoader,
} from './loaders/is-following.loader';

@Injectable({ scope: Scope.REQUEST })
export class UsersLoaderService {
  private _loader: IsFollowingLoader;

  constructor(
    @InjectRepository(UserFollow)
    private readonly userFollowRepo: Repository<UserFollow>,
  ) {}

  public init(currentUserId: string): IsFollowingLoader {
    if (!this._loader) {
      this._loader = createIsFollowingLoader(
        this.userFollowRepo,
        currentUserId,
      );
    }
    return this._loader;
  }
}
