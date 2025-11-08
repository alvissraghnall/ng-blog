import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { OAuthBaseStrategy } from './oauth-base.strategy';
import { OAuthConfig } from '../interfaces/oauth-config.interface';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export class GithubOAuthStrategy extends OAuthBaseStrategy {
  protected readonly providerName = 'github';

  constructor(
    private readonly configService: ConfigService,
    protected readonly authService: AuthService,
  ) {
    super(authService, GithubOAuthStrategy.getConfig(configService));
  }

  private static getConfig(configService: ConfigService): OAuthConfig {
    return {
      authorizationURL: 'https://github.com/login/oauth/authorize',
      tokenURL: 'https://github.com/login/oauth/access_token',
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    };
  }

  async authenticate(code: string, redirectUri?: string): Promise<any> {
    try {
      const accessToken = await this.exchangeCodeForToken(code, redirectUri);

      const profile = await this.getUserProfile(accessToken);

      const user = await this.authService.validateOAuthLogin(profile);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `GitHub OAuth authentication failed: ${error.message}`,
      );
    }
  }

  private async exchangeCodeForToken(
    code: string,
    redirectUri?: string,
  ): Promise<string> {
    const tokenUrl = 'https://github.com/login/oauth/access_token';
    const params = new URLSearchParams({
      client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
      code: code,
      redirect_uri:
        redirectUri || this.configService.get<string>('GITHUB_CALLBACK_URL'),
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new BadRequestException('GitHub token exchange failed');
      }

      const tokenData = await response.json();

      if (tokenData.error) {
        throw new BadRequestException(
          `GitHub OAuth error: ${tokenData.error_description || tokenData.error}`,
        );
      }

      return tokenData.access_token;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to exchange code for access token',
      );
    }
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'NgBlog-App',
        },
      });

      if (!userResponse.ok) {
        throw new BadRequestException('Failed to fetch GitHub user profile');
      }

      const userData = await userResponse.json();

      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'NgBlog-App',
        },
      });

      let emails = [];
      if (emailsResponse.ok) {
        emails = await emailsResponse.json();
      }

      return this.normalizeProfile({ ...userData, emails });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch GitHub user profile',
      );
    }
  }

  protected normalizeProfile(githubProfile: any): OAuthProfile {
    const primaryEmail =
      githubProfile.emails?.find(
        (email: any) => email.primary && email.verified,
      ) ||
      githubProfile.emails?.find((email: any) => email.primary) ||
      githubProfile.emails?.find((email: any) => email.verified) ||
      githubProfile.emails?.[0];

    // Split name if available, otherwise use login as fallback
    let firstName = '';
    let lastName = '';

    if (githubProfile.name) {
      const nameParts = githubProfile.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    return {
      id: githubProfile.id.toString(),
      email:
        primaryEmail?.email ||
        githubProfile.email ||
        `${githubProfile.id}+${this.providerName}@users.noreply.github.com`,
      name: githubProfile.name || githubProfile.login,
      firstName: firstName,
      lastName: lastName,
      picture: githubProfile.avatar_url,
      provider: this.providerName,
    };
  }
}
