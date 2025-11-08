import {
  Injectable,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';
import { OAuthInput } from '../dto/oauth.input';
import { GoogleOAuthStrategy } from '../strategy/google-oauth.strategy';
import { GithubOAuthStrategy } from '../strategy/github-oauth.strategy';

@Injectable()
export class OAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly googleStrategy: GoogleOAuthStrategy,
    private readonly githubStrategy: GithubOAuthStrategy,
  ) {}

  async getAuthorizationUrl(provider: string): Promise<string> {
    const baseUrls = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
    };

    const scopes = {
      google: 'email profile',
      github: 'user:email',
    };

    const baseUrl = baseUrls[provider];
    if (!baseUrl) {
      throw new BadRequestException(`Unsupported provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: this.configService.get(`${provider.toUpperCase()}_CLIENT_ID`),
      redirect_uri: this.configService.get(
        `${provider.toUpperCase()}_CALLBACK_URL`,
      ),
      response_type: 'code',
      scope: scopes[provider],
      ...(provider === 'google' && {
        access_type: 'offline',
        prompt: 'consent',
      }),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  async authenticate(oauthInput: OAuthInput): Promise<User> {
    switch (oauthInput.provider) {
      case 'google':
        return this.googleStrategy.authenticate(
          oauthInput.code,
          oauthInput.redirectUri,
        );

      case 'github':
        return this.githubStrategy.authenticate(
          oauthInput.code,
          oauthInput.redirectUri,
        );

      case 'facebook':
        throw new NotImplementedException('Facebook OAuth not implemented yet');

      case 'apple':
        throw new NotImplementedException('Apple OAuth not implemented yet');

      default:
        throw new BadRequestException(
          `Unsupported provider: ${oauthInput.provider}`,
        );
    }
  }
}
