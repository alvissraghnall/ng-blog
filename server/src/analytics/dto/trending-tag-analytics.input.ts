import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TrendingTag {
  @Field()
  name: string;

  @Field(() => Int)
  count: number;
}
