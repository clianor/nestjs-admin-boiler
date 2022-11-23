import { ClassSerializerInterceptor, Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import configuration from './common/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('production', 'development').default('development'),
        PORT: Joi.number().default(8000),
        PRIVATE_KEY: Joi.string().required(),
        // database
        database: {
          MYSQL_HOST: Joi.string().required(),
          MYSQL_PORT: Joi.number().required(),
          MYSQL_USER: Joi.string().required(),
          MYSQL_PASSWORD: Joi.string().required(),
          MYSQL_DATABASE: Joi.string().required(),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        Logger.debug(configService.get('database'));
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
