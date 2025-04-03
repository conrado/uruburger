import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // Enable CORS for frontend requests

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('UruBurger API')
    .setDescription('API documentation for UruBurger restaurant backend')
    .setVersion('1.0')
    .addTag('menu-items', 'Menu item management')
    .addTag('menu-orders', 'Order management')
    .addTag('clock', 'Server time information')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001); // Using port 3001 to avoid conflict with React's default port 3000
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(
    `Swagger documentation is available at: ${await app.getUrl()}/api`,
  );
}
bootstrap();
