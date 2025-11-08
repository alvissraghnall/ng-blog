import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

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
      maxFileSize: 300000,
      maxFiles: 1,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);

  console.log(await app.getUrl());
  console.log('sucker!');
}
bootstrap();

/**
 * 
 * <ul>
  <li *ngFor="let user of users; let i = index; let odd = odd"
      [class.odd]="odd">
    {{i + 1}}. {{ user.name }}
  </li>
</ul>
 */
