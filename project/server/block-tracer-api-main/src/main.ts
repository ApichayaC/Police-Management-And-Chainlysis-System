import { NestFactory } from '@nestjs/core';
import config from './config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(config.PORT);
}
bootstrap();
