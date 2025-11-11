import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from 'common/filters/graphql-exception.filter';
import { SharedJwtModule } from 'common/shared-jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedJwtModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      // dropSchema: true,
      autoLoadEntities: true,
      // schema: "all"
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      //autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
        // const graphQLError = error as GraphQLError;

        // if (formattedError.extensions?.code === 'VALIDATION_ERROR' ||
        //     formattedError.extensions?.code === 'UNAUTHENTICATED' ||
        //     formattedError.extensions?.code === 'TOKEN_EXPIRED' ||
        //     formattedError.extensions?.code === 'INVALID_TOKEN') {
        //   return formattedError;
        // }

        // const extensions = {
        //   code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
        //   timestamp: new Date().toISOString(),
        // };

        // if (process.env.NODE_ENV === 'production') {
        //   if (extensions.code === 'INTERNAL_SERVER_ERROR') {
        //     return {
        //       message: 'An unexpected error occurred',
        //       extensions,
        //     };
        //   }
        // }

        // return {
        //   message: formattedError.message,
        //   extensions: {
        //     ...extensions,
        //     ...formattedError.extensions,
        //   },
        //   path: formattedError.path,
        //   locations: formattedError.locations,
        // };
        return formattedError;
      },
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    CloudinaryModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
