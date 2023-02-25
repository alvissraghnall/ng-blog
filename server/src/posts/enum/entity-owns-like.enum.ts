import { registerEnumType } from "@nestjs/graphql";

export enum EntityOwnsLike {
    POST = "Post",
    COMMENT = "Comment"
}

registerEnumType(EntityOwnsLike, {
    name: "EntityOwnsLike"
})