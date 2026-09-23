import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { JsonStorageService } from '../storage/json-storage.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService,JsonStorageService],
})
export class PlacesModule {}
