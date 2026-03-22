import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: [
      'https://cric-xi.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true,
  });
  await app.init();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};
