import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
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
