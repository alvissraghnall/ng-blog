import { Test, TestingModule } from '@nestjs/testing';
import { UsersLoaderService } from './users-loader.service';

describe('UsersLoaderService', () => {
  let service: UsersLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersLoaderService],
    }).compile();

    service = module.get<UsersLoaderService>(UsersLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
