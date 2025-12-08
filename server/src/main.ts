import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { createHandler } from 'graphql-sse/lib/use/express';
import { generateSchema } from './create-resolver';
import { AuthService } from 'auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GraphQLSchemaHost } from '@nestjs/graphql';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  // app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const detailed = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
          children: error.children,
        }));

        const messages = errors.flatMap((e) =>
          Object.values(e.constraints || {}),
        );

        // If there are any constraint messages, prefer ~~
        if (messages.length > 0) {
          return new BadRequestException(messages.join(', '));
        }

        // Otherwise fall back to detailed structure (like nested validation)
        return new BadRequestException({
          message: 'Validation failed',
          errors: detailed,
        });
      },
    }),
  );
  app.use(
    graphqlUploadExpress({
      maxFileSize: 450000,
      maxFiles: 1,
    }),
  );

  const authService = app.get(AuthService);
  const jwtService = app.get(JwtService);

  const schema = await generateSchema();

  const sseGraphqlHandler = createHandler({
    schema,
    authenticate: async (req) => {
      let user = null;
      const token = req.headers.get('Authorization').replace('Bearer ', '');

      if (token) {
        try {
          const payload = jwtService.verify(token);
          user = await authService.validateUserByPayload(payload);
        } catch (e) {
          console.error('SSE Auth failed');
        }
      }

      return token;
    },
  });

  app.getHttpAdapter().use('/graphql/stream', sseGraphqlHandler);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);

  console.log(await app.getUrl());
  console.log('sucker!');
}
bootstrap();
