import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsAscii, MinLength, IsUrl, IsOptional } from 'class-validator';

@InputType()
export class OAuthInput {
  @Field()
  @IsIn(['google', 'github', 'facebook'])
  provider: string;

  @Field()
  @MinLength(3)
  @IsAscii()
  code: string;

  @Field({ nullable: true })
  @MinLength(3)
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    require_port: true,
  })
  @IsOptional()
  redirectUri?: string;
}
