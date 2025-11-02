import { Field, InputType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType()
export class OAuthInput {
  @Field()
  @IsIn(['google', 'github', 'facebook'])
  provider: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  redirectUri?: string;
}
