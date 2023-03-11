import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
// import * as gue from "graphql-upload/graphqlUploadExpress.js";
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true 
  });
  app.setGlobalPrefix("/api/v1");
  app.useGlobalPipes(new ValidationPipe({
    // forbidUnknownValues: false
  }));
  // app.use(graphqlUploadExpress({
  //   maxFileSize: 2000000,
  //   // maxFiles: 10
  // }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
  
  console.log(await app.getUrl());
  console.log("sucker!")


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