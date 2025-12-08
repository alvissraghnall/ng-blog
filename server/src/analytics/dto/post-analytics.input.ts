import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class PostAnalytics {
  @Field(() => Int)
  views: number;

  @Field(() => Int)
  likes: number;

  @Field(() => Int)
  comments: number;

  @Field(() => Float)
  engagementRate: number;
}
