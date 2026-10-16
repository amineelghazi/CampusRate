import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // CORS configuration
  app.enableCors({
    origin: config.get<string>('CORS_ORIGINS','http://localhost:3000').split(',') ,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  // helmet security headers
  app.use(helmet());
  // API url prefix
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ProblemDetailsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CampusRate API')
    .setDescription('Browse campus places and submit reviews')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document); // -> http://localhost:3000/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
