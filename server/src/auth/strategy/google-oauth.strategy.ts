import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { OAuthBaseStrategy } from './oauth-base.strategy';
import { OAuthConfig } from '../interfaces/oauth-config.interface';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export class GoogleOAuthStrategy extends OAuthBaseStrategy {
  protected readonly providerName = 'google';

  constructor(
    private readonly configService: ConfigService,
    protected readonly authService: AuthService,
  ) {
    super(authService, GoogleOAuthStrategy.getConfig(configService));
  }

  private static getConfig(configService: ConfigService): OAuthConfig {
    return {
      authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    };
  }

  async authenticate(code: string, redirectUri?: string): Promise<any> {
    try {
      const accessToken = await this.exchangeCodeForToken(code, redirectUri);
      
      const profile = await this.getUserProfile(accessToken);
      
      const user = await this.authService.validateOAuthLogin(profile);
      
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Google OAuth authentication failed: ${error.message}`);
    }
  }

  private async exchangeCodeForToken(code: string, redirectUri?: string): Promise<string> {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri || this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new BadRequestException(`Google token exchange failed: ${errorData.error_description || errorData.error}`);
      }

      const tokenData = await response.json();
      return tokenData.access_token;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to exchange code for access token');
    }
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    try {
      const peopleResponse = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!peopleResponse.ok) {
        return await this.getBasicProfile(accessToken);
      }

      const peopleData = await peopleResponse.json();
      return this.normalizeProfile(peopleData);
    } catch (error) {
      return await this.getBasicProfile(accessToken);
    }
  }

  private async getBasicProfile(accessToken: string): Promise<OAuthProfile> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to fetch Google user profile');
    }

    const userInfo = await response.json();
    return this.normalizeBasicProfile(userInfo);
  }

  protected normalizeProfile(googleProfile: any): OAuthProfile {
    const primaryEmail = googleProfile.emailAddresses?.find((email: any) => email.metadata?.primary) || googleProfile.emailAddresses?.[0];
    const primaryName = googleProfile.names?.find((name: any) => name.metadata?.primary) || googleProfile.names?.[0];
    const primaryPhoto = googleProfile.photos?.find((photo: any) => photo.metadata?.primary) || googleProfile.photos?.[0];

    return {
      id: googleProfile.resourceName?.replace('people/', '') || '',
      email: primaryEmail?.value || '',
      name: primaryName?.displayName || '',
      firstName: primaryName?.givenName || '',
      lastName: primaryName?.familyName || '',
      picture: primaryPhoto?.url || '',
      provider: this.providerName,
    };
  }

  private normalizeBasicProfile(userInfo: any): OAuthProfile {
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      picture: userInfo.picture,
      provider: this.providerName,
    };
  }
}
