import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class UserAnalytics {
  @Field(() => Int)
  totalPosts: number;

  @Field(() => Int)
  totalLikes: number;

  @Field(() => Int)
  totalComments: number;

  @Field(() => Int)
  totalFollowers: number;

  @Field(() => Int)
  totalFollowing: number;

  @Field(() => Int)
  postViews: number;

  @Field(() => Float)
  engagementRate: number; //5.5%
}
