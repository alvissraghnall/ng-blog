import { HttpException, HttpStatus } from "@nestjs/common";

export class OAuthException extends HttpException {
  constructor(message: string, provider: string) {
    super(`OAuth Error (${provider}): ${message}`, HttpStatus.BAD_REQUEST);
  }
}
