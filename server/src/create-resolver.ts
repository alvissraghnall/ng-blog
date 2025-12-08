import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { NotificationsResolver } from 'notifications/notifications.resolver';
import { CommentsResolver } from 'posts/comments/comments.resolver';
import { LikesResolver } from 'posts/likes/likes.resolver';
import { PostsResolver } from 'posts/posts.resolver';
import { SearchResolver } from 'search/search.resolver';
import { UsersResolver } from 'users/users.resolver';

export async function generateSchema(): Promise<GraphQLSchema> {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([
    NotificationsResolver,
    UsersResolver,
    PostsResolver,
    CommentsResolver,
    LikesResolver,
    SearchResolver,
  ]);

  return schema;
}
