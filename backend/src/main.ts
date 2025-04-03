import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // Enable CORS for frontend requests
  await app.listen(3001); // Using port 3001 to avoid conflict with React's default port 3000
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
