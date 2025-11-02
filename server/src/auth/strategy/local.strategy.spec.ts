import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { User } from 'users/entities/user.entity';

const mockAuthService = {
  validatePasswordUser: jest.fn(),
};

const mockUser = {
  id: 'user-id',
  username: 'testuser',
} as User;

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      const username = 'testuser';
      const password = 'password123';
      authService.validatePasswordUser.mockResolvedValue(mockUser);

      const result = await strategy.validate(username, password);

      expect(authService.validatePasswordUser).toHaveBeenCalledWith(
        username,
        password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null or throw if validation fails (as per authService)', async () => {
      authService.validatePasswordUser.mockResolvedValue(null);

      const result = await strategy.validate('testuser', 'wrongpass');

      expect(authService.validatePasswordUser).toHaveBeenCalledWith(
        'testuser',
        'wrongpass',
      );
      expect(result).toBeNull();
    });
  });
});
