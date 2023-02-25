import { registerEnumType } from "@nestjs/graphql";

export enum Category {
    FASHION = "fashion",
    CUISINE = "cuisine",
    TECHNOLOGY  = "technology",
    DIY = "diy",
    LIFESTYLE = "lifestyle",
    TRAVEL = "travel",
    CINEMA = "cinema"
}

registerEnumType(Category, {
    name: "Category",
})