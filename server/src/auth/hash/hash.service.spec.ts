import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('HashService', () => {
  let service: HashService;
  let mockBcrypt: jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
    mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password with 10 salt rounds', async () => {
      const password = 'plainpassword';
      const hashedPassword = 'hashedpassword';

      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await service.hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      const password = 'plainpassword';
      const hash = 'hashedpassword';

      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.comparePassword(password, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      const password = 'wrongpassword';
      const hash = 'hashedpassword';

      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.comparePassword(password, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});
