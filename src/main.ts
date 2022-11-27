import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }
  app.enableCors();
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('NestJS Docs')
      .setDescription('Boilerplate for admin')
      .setVersion('0.0.1')
      .addTag('api')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Token' }, 'access-token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  const port = process.env.PORT;
  await app.listen(port, () => {
    Logger.verbose(`🚀 Server is Started!\r\n`);
    Logger.verbose(`📌 Local: http://localhost:${port}`);
    Logger.verbose(`📍 Local: http://0.0.0.0:${port}`);
  });
}
bootstrap();
