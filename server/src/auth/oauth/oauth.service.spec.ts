import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from './oauth.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { GoogleOAuthStrategy } from '../strategy/google-oauth.strategy';
import { GithubOAuthStrategy } from '../strategy/github-oauth.strategy';
import { BadRequestException, NotImplementedException } from '@nestjs/common';
import { User } from 'users/entities/user.entity';
import { OAuthInput } from '../dto/oauth.input';

const mockConfigService = {
  get: jest.fn(),
};

const mockAuthService = {};

const mockGoogleStrategy = {
  authenticate: jest.fn(),
};

const mockGithubStrategy = {
  authenticate: jest.fn(),
};

const mockUser = {
  id: 'user-123',
  username: 'testuser',
} as User;

describe('OAuthService', () => {
  let service: OAuthService;
  let configService: jest.Mocked<typeof mockConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: GoogleOAuthStrategy, useValue: mockGoogleStrategy },
        { provide: GithubOAuthStrategy, useValue: mockGithubStrategy },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    configService = module.get(ConfigService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorizationUrl', () => {
    it('should return the correct Google authorization URL', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'GOOGLE_CLIENT_ID') return 'google-client-id';
        if (key === 'GOOGLE_CALLBACK_URL') return 'http://localhost/google-cb';
        return null;
      });

      const urlString = await service.getAuthorizationUrl('google');
      const url = new URL(urlString);
      const params = url.searchParams;

      expect(url.origin + url.pathname).toBe(
        'https://accounts.google.com/o/oauth2/v2/auth',
      );
      expect(params.get('client_id')).toBe('google-client-id');
      expect(params.get('redirect_uri')).toBe('http://localhost/google-cb');
      expect(params.get('response_type')).toBe('code');
      expect(params.get('scope')).toBe('email profile');
      expect(params.get('access_type')).toBe('offline');
      expect(params.get('prompt')).toBe('consent');
    });

    it('should return the correct GitHub authorization URL', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'GITHUB_CLIENT_ID') return 'github-client-id';
        if (key === 'GITHUB_CALLBACK_URL') return 'http://localhost/github-cb';
        return null;
      });

      const urlString = await service.getAuthorizationUrl('github');
      const url = new URL(urlString);
      const params = url.searchParams;

      expect(url.origin + url.pathname).toBe(
        'https://github.com/login/oauth/authorize',
      );
      expect(params.get('client_id')).toBe('github-client-id');
      expect(params.get('redirect_uri')).toBe('http://localhost/github-cb');
      expect(params.get('response_type')).toBe('code');
      expect(params.get('scope')).toBe('user:email');
      expect(params.has('access_type')).toBe(false);
    });

    it('should throw BadRequestException for an unsupported provider', async () => {
      await expect(service.getAuthorizationUrl('facebook')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getAuthorizationUrl('facebook')).rejects.toThrow(
        'Unsupported provider: facebook',
      );
    });
  });

  describe('authenticate', () => {
    it('should call GoogleStrategy.authenticate for google provider', async () => {
      const oauthInput: OAuthInput = {
        provider: 'google',
        code: 'google-code',
        redirectUri: 'http://localhost/google-cb',
      };
      mockGoogleStrategy.authenticate.mockResolvedValue(mockUser);

      const result = await service.authenticate(oauthInput);

      expect(result).toEqual(mockUser);
      expect(mockGoogleStrategy.authenticate).toHaveBeenCalledWith(
        'google-code',
        'http://localhost/google-cb',
      );
      expect(mockGithubStrategy.authenticate).not.toHaveBeenCalled();
    });

    it('should call GithubStrategy.authenticate for github provider', async () => {
      const oauthInput: OAuthInput = {
        provider: 'github',
        code: 'github-code',
        redirectUri: 'http://localhost/github-cb',
      };
      mockGithubStrategy.authenticate.mockResolvedValue(mockUser);

      const result = await service.authenticate(oauthInput);

      expect(result).toEqual(mockUser);
      expect(mockGithubStrategy.authenticate).toHaveBeenCalledWith(
        'github-code',
        'http://localhost/github-cb',
      );
      expect(mockGoogleStrategy.authenticate).not.toHaveBeenCalled();
    });

    it('should throw NotImplementedException for facebook', async () => {
      const oauthInput: OAuthInput = {
        provider: 'facebook',
        code: 'fb-code',
      };
      await expect(service.authenticate(oauthInput)).rejects.toThrow(
        NotImplementedException,
      );
      await expect(service.authenticate(oauthInput)).rejects.toThrow(
        'Facebook OAuth not implemented yet',
      );
    });

    it('should throw NotImplementedException for apple', async () => {
      const oauthInput: OAuthInput = {
        provider: 'apple',
        code: 'apple-code',
      };
      await expect(service.authenticate(oauthInput)).rejects.toThrow(
        NotImplementedException,
      );
      await expect(service.authenticate(oauthInput)).rejects.toThrow(
        'Apple OAuth not implemented yet',
      );
    });

    it('should throw BadRequestException for an unsupported provider', async () => {
      const oauthInput: OAuthInput = {
        provider: 'linkedin',
        code: 'li-code',
      };
      await expect(service.authenticate(oauthInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.authenticate(oauthInput)).rejects.toThrow(
        'Unsupported provider: linkedin',
      );
    });
  });
});
