import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(cookieParser());
  const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API description')
  .setVersion('1.0')
  .addTag('API Tag')
  .build();

// Create Swagger document
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
