import { InputType, Field, Int, PickType } from "@nestjs/graphql";
import { CreateLikeInput } from "posts/likes/dto/create-like.input";

@InputType()
export class LikePostInput extends PickType(CreateLikeInput, ['postId'] as const) {}
// export class LikePostInput {
//     @Field(() => Int)
//     postId: number;
// }