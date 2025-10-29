import { User } from "users/entities/user.entity";

export class UserBuilder {
  private readonly user: User;

  constructor () {
    this.user = new User();
  }

  withUsername(username: string): this {
    this.user.username = username;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  withAvatar(avatar: string): this {
    this.user.avatar = avatar;
    return this;
  }

  withOAuth(provider: string, oauthId: string): this {
    this.user.oauthProvider = provider;
    this.user.oauthId = oauthId;
    return this;
  }

  withBio(bio: string): this {
    this.user.bio = bio;
    return this;
  }

  verifiedEmail(): this {
    this.user.emailVerified = true;
    return this;
  }

  build(): User {
    if (!this.user.email) throw new Error("Email is required");
    if (!this.user.username) throw new Error("Username is required");

    const hasPassword = !!this.user.password;
    const hasOAuth = !!this.user.oauthProvider && !!this.user.oauthId;
    if (!hasPassword && !hasOAuth) {
      throw new Error("User must have either password or OAuth credentials");
    }

    return this.user;
  }
}
