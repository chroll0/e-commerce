import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // აქ ვაყენებთ global validation
  app.useGlobalPipes(new ValidationPipe());

  // Optional: CORS & Helmet
  app.enableCors();
  // import helmet from 'helmet'; app.use(helmet());

  await app.listen(3001);
}
bootstrap();
