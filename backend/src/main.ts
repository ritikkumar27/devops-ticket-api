import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS so our frontend can communicate with the backend
  app.enableCors();

  // Validate incoming requests against DTO rules automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('DevOps Ticket Manager API')
    .setDescription('REST API for DevOps & SRE incident and operational ticket tracking')
    .setVersion(process.env.APP_VERSION || '1.0.0')
    .addTag('Health & Monitoring', 'Liveness, readiness, and resource health endpoints')
    .addTag('Version & Deployment', 'Release metadata for deployment verification and rollbacks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`====================================================`);
  logger.log(`🚀 DevOps Ticket Manager API running on port ${port}`);
  logger.log(`📄 Swagger Docs available at http://localhost:${port}/api/docs`);
  logger.log(`🩺 Health endpoint at http://localhost:${port}/health`);
  logger.log(`🔖 Version endpoint at http://localhost:${port}/version`);
  logger.log(`====================================================`);
}

void bootstrap();