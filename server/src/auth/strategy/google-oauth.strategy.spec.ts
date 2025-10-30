import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOAuthStrategy } from './google-oauth.strategy';
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
      GOOGLE_CLIENT_ID: 'google-client-id',
      GOOGLE_CLIENT_SECRET: 'google-client-secret',
      GOOGLE_CALLBACK_URL: 'http://localhost/auth/google/callback',
    };
    return config[key];
  }),
};

const mockUser = {
  id: 'user-id',
  username: 'google-user',
} as User;

const mockGoogleToken = {
  access_token: 'mock-access-token',
};

const mockGooglePeopleData = {
  resourceName: 'people/12345',
  emailAddresses: [{ value: 'primary@google.com', metadata: { primary: true } }],
  names: [
    {
      displayName: 'Google User',
      givenName: 'Google',
      familyName: 'User',
      metadata: { primary: true },
    },
  ],
  photos: [{ url: 'http://example.com/pic.png', metadata: { primary: true } }],
};

const mockGoogleBasicData = {
  id: '54321',
  email: 'basic@google.com',
  name: 'Basic User',
  given_name: 'Basic',
  family_name: 'User',
  picture: 'http://example.com/basic.png',
};

const mockNormalizedProfile: OAuthProfile = {
  id: '12345',
  email: 'primary@google.com',
  name: 'Google User',
  firstName: 'Google',
  lastName: 'User',
  picture: 'http://example.com/pic.png',
  provider: 'google',
};

const originalFetch = global.fetch;

describe('GoogleOAuthStrategy', () => {
  let strategy: GoogleOAuthStrategy;
  let authService: typeof mockAuthService;

  beforeEach(async () => {

    global.fetch = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleOAuthStrategy,
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

    strategy = module.get<GoogleOAuthStrategy>(GoogleOAuthStrategy);
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
        new Response(JSON.stringify(mockGoogleToken), { status: 200 }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGooglePeopleData), { status: 200 }),
      );

      authService.validateOAuthLogin.mockResolvedValue(mockUser);

      const result = await strategy.authenticate('test-code');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://oauth2.googleapis.com/token',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('code=test-code'),
        }),
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos',
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockGoogleToken.access_token}`, "Content-Type": "application/json" },
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

    it('should throw on failed user profile fetch (after fallback)', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGoogleToken), { status: 200 }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
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
    it('should fetch and normalize a profile from People API', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGooglePeopleData), { status: 200 }),
      );

      const profile = await strategy.getUserProfile('test-token');
      expect(profile).toEqual(mockNormalizedProfile);
    });

    it('should fall back to basic profile if People API fails', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockGoogleBasicData), { status: 200 }),
      );

      const profile = await strategy.getUserProfile('test-token');
      expect(profile).toEqual({
        id: '54321',
        email: 'basic@google.com',
        name: 'Basic User',
        firstName: 'Basic',
        lastName: 'User',
        picture: 'http://example.com/basic.png',
        provider: 'google',
      });
    });

    it('should throw BadRequestException if all profile fetches fail', async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
      );

      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
      );

	  mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 401, statusText: 'Unauthorized' }),
      );

      await expect(strategy.getUserProfile('bad-token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
