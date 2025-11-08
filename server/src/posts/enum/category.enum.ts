import { registerEnumType } from '@nestjs/graphql';

export enum Category {
  FASHION = 'FASHION',
  CUISINE = 'CUISINE',
  TECHNOLOGY = 'TECHNOLOGY',
  DIY = 'DIY',
  LIFESTYLE = 'LIFESTYLE',
  TRAVEL = 'TRAVEL',
  CINEMA = 'CINEMA',
}

registerEnumType(Category, {
  name: 'Category',
});
