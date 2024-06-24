import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  app.setViewEngine('pug');

  const staticAssetsPath = path.join(__dirname, '..', 'src', 'public');
  app.useStaticAssets(staticAssetsPath);
  console.log('Static assets path:', staticAssetsPath);

  const viewsPath = path.join(__dirname, '..', 'src', 'views');
  app.setBaseViewsDir(viewsPath);
  console.log('Views path:', viewsPath);

  await app.listen(5000);
  console.log('Application is running on: http://localhost:5000');
}

bootstrap();