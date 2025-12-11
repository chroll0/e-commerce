import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
