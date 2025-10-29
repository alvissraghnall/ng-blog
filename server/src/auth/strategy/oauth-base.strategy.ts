import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import { OAuthConfig } from '../interfaces/oauth-config.interface';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export abstract class OAuthBaseStrategy extends PassportStrategy(Strategy, "oauth") {
  protected abstract readonly providerName: string;

  constructor(
    protected readonly authService: AuthService,
    config: OAuthConfig
  ) {
    super(config);
  }

  abstract authenticate(code: string, redirectUri?: string): Promise<any>;

  abstract getUserProfile(accessToken: string): Promise<OAuthProfile>;

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    try {
      const userProfile = await this.getUserProfile(accessToken);
      const user = await this.authService.validateOAuthLogin(userProfile);
      return user;
    } catch (error) {
      throw new Error(`OAuth validation failed for ${this.providerName}: ${error.message}`);
    }
  }

  protected abstract normalizeProfile(rawProfile: any): OAuthProfile;
}
