import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().required(),
        DATA_FILE_PATH: Joi.string().required(),
      }),
    }),
    StorageModule,
  ],
})
export class AppModule {}