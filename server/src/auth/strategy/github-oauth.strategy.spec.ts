import { Test, TestingModule } from '@nestjs/testing';
import { GithubOAuthStrategy } from './github-oauth.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from 'users/entities/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

const mockAuthService = {
  validateOAuthLogin: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      GITHUB_CLIENT_ID: 'gh-client-id',
      GITHUB_CLIENT_SECRET: 'gh-client-secret',
      GITHUB_CALLBACK_URL: 'http://localhost/auth/github/callback',
    };
    return config[key];
  }),
};

const mockUser = {
  id: 'user-id',
  username: 'github-user',
} as User;

const mockGithubToken = {
  access_token: 'mock-access-token',
};

const mockGithubProfileData = {
  id: 12345,
  login: 'github-user',
  name: 'Github User',
  avatar_url: 'http://example.com/avatar.png',
  email: null, 
};

const mockGithubEmailsData = [
  { email: 'second@example.com', primary: false, verified: true },
  { email: 'primary@example.com', primary: true, verified: true },
];

const mockNormalizedProfile: OAuthProfile = {
  id: '12345',
  email: 'primary@example.com',
  name: 'Github User',
  firstName: 'Github',
  lastName: 'User',
  picture: 'http://example.com/avatar.png',
  provider: 'github',
};

const originalFetch = global.fetch;

describe('GithubOAuthStrategy', () => {
  let strategy: GithubOAuthStrategy;
  let authService: typeof mockAuthService;

  beforeEach(async () => {

    global.fetch = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubOAuthStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<GithubOAuthStrategy>(GithubOAuthStrategy);
    authService = module.get(AuthService);
  });

  afterEach(() => {

    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('authenticate', () => {
    it('should successfully authenticate and return a user', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGithubToken), { status: 200 }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGithubProfileData), { status: 200 }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGithubEmailsData), { status: 200 }),
      );

      authService.validateOAuthLogin.mockResolvedValue(mockUser);

      const result = await strategy.authenticate('test-code');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://github.com/login/oauth/access_token',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('code=test-code'),
          headers: expect.objectContaining({ Accept: 'application/json' }),
        }),
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/user',
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: `Bearer ${mockGithubToken.access_token}` }),
        }),
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/user/emails',
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: `Bearer ${mockGithubToken.access_token}` }),
        }),
      );

      expect(authService.validateOAuthLogin).toHaveBeenCalledWith(
        mockNormalizedProfile,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw on failed token exchange', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'bad_code' }), { status: 400 }),
      );

      await expect(strategy.authenticate('bad-code')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw on failed user profile fetch', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGithubToken), { status: 200 }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
      );

      await expect(strategy.authenticate('test-code')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUserProfile', () => {
    it('should fetch and normalize a profile', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGithubProfileData), { status: 200 }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGithubEmailsData), { status: 200 }),
      );

      const profile = await strategy.getUserProfile('test-token');
      expect(profile).toEqual(mockNormalizedProfile);
    });

    it('should throw BadRequestException if user fetch fails', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
      );

      await expect(strategy.getUserProfile('bad-token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('normalizeProfile', () => {

    it('should use primary verified email', () => {
	  const normalizeProfile = (strategy as any).normalizeProfile.bind(strategy);
      const profile = normalizeProfile({
        ...mockGithubProfileData,
        emails: [
          { email: 'a@a.com', primary: false, verified: false },
          { email: 'b@b.com', primary: true, verified: true },
          { email: 'c@c.com', primary: false, verified: true },
        ],
      });
      expect(profile.email).toBe('b@b.com');
    });

    it('should use login for name if name is null', () => {
	  const normalizeProfile = (strategy as any).normalizeProfile.bind(strategy);
      const profile = normalizeProfile({
        ...mockGithubProfileData,
        name: null,
      });
      expect(profile.name).toBe('github-user');
    });

    it('should create a fallback email if no emails are found', () => {
      const normalizeProfile = (strategy as any).normalizeProfile.bind(strategy);
      const profile = normalizeProfile({
        ...mockGithubProfileData,
        emails: [],
      });
      expect(profile.email).toBe('12345+github@users.noreply.github.com');
    });
  });

  describe('validate (from OAuthBaseStrategy)', () => {
    it('should call getUserProfile and validateOAuthLogin', async () => {

      jest
        .spyOn(strategy, 'getUserProfile')
        .mockResolvedValue(mockNormalizedProfile);
      authService.validateOAuthLogin.mockResolvedValue(mockUser);

      const result = await strategy.validate('test-token', '', {});

      expect(strategy.getUserProfile).toHaveBeenCalledWith('test-token');
      expect(authService.validateOAuthLogin).toHaveBeenCalledWith(
        mockNormalizedProfile,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw if getUserProfile fails', async () => {
      jest
        .spyOn(strategy, 'getUserProfile')
        .mockRejectedValue(new Error('Profile fetch failed'));

      await expect(strategy.validate('test-token', '', {})).rejects.toThrow(
        'OAuth validation failed for github: Profile fetch failed',
      );
    });
  });
});
