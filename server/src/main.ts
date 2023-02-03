import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("/api/v1");

  console.log(await app.getUrl());
  console.log("sucker!")

  await app.listen(3000);

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