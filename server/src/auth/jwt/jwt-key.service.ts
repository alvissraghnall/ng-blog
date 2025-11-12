import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtKeyService {
  constructor(private readonly configService: ConfigService) {}

  async getPrivKey(): Promise<Buffer> {
    const base64Key = this.configService.get<string>("JWT_PRIVATE_KEY_BASE64");
    if (!base64Key) {
      throw new Error("Missing environment variable: JWT_PRIVATE_KEY_BASE64");
    }
    return Buffer.from(base64Key, "base64");
  }

  async getPubKey(): Promise<Buffer> {
    const base64Key = this.configService.get<string>("JWT_PUBLIC_KEY_BASE64");
    if (!base64Key) {
      throw new Error("Missing environment variable: JWT_PUBLIC_KEY_BASE64");
    }
    return Buffer.from(base64Key, "base64");
  }
}
