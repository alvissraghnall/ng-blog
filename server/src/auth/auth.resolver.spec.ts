import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { OAuthService } from './oauth/oauth.service';
import { LoginResponse } from './dto/login.response';
import { User } from '../users/entities/user.entity';
import { OAuthInput } from './dto/oauth.input';
import { CreateUserInput } from '../users/dto/create-user.input';

jest.mock('users/dto/create-user.input', () => ({
  CreateUserInput: class {},
}));

jest.mock('auth/dto/login-user.input', () => ({
  LoginUserInput: class {},
}));

jest.mock('auth/dto/oauth.input', () => ({
  OAuthInput: class {},
}));

const mockAuthService = {
  login: jest.fn(),
  createPasswordUser: jest.fn(),
};

const mockOAuthService = {
  authenticate: jest.fn(),
  getAuthorizationUrl: jest.fn(),
};

const mockUser = { id: 'user-id' } as User;
const mockLoginResponse = {
  access_token: 'mock-token',
  user: mockUser,
} as LoginResponse;

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: jest.Mocked<typeof mockAuthService>;
  let oauthService: jest.Mocked<typeof mockOAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
        { provide: OAuthService, useValue: mockOAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get(AuthService);
    oauthService = module.get(OAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the context user', () => {
      const context = { user: mockUser };
      authService.login.mockReturnValue(mockLoginResponse);

      const result = resolver.login({} as any, context);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('oauthLogin', () => {
    it('should authenticate via OAuth and return a login response', async () => {
      const oauthInput: OAuthInput = { provider: 'google', code: 'test-code' };
      oauthService.authenticate.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await resolver.oauthLogin(oauthInput);

      expect(oauthService.authenticate).toHaveBeenCalledWith(oauthInput);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('getOAuthUrl', () => {
    it('should return an authorization URL from OAuthService', async () => {
      const url = 'http://oauth-url.com';
      oauthService.getAuthorizationUrl.mockResolvedValue(url);

      const result = await resolver.getOAuthUrl('google');

      expect(oauthService.getAuthorizationUrl).toHaveBeenCalledWith('google');
      expect(result).toBe(url);
    });
  });

  describe('signup', () => {
    it('should call authService.createPasswordUser', async () => {
      const createUserInput: CreateUserInput = {
        username: 'test',
        password: '123',
        confirmPassword: '123',
        email: 'test@test.com',
      };
      authService.createPasswordUser.mockResolvedValue(mockUser);

      const result = await resolver.signup(createUserInput);

      expect(authService.createPasswordUser).toHaveBeenCalledWith(
        createUserInput,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('auth', () => {
    it('should return a test string', () => {
      expect(resolver.auth()).toBe("God's boy.");
    });
  });

  describe('checkJwt', () => {
    it('should return true', () => {
      expect(resolver.checkJwt()).toBe(true);
    });
  });

  describe('whoami', () => {
    it('should return the current user', () => {
      const result = resolver.whoami(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
