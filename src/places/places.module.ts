import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Place,PlaceSchema } from './schemas/place.schema';
import { PlacesRepository } from './places.repository';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Place.name  , schema: PlaceSchema}]),
    ReviewsModule
  ],
  controllers: [PlacesController],
  providers:[PlacesService, PlacesRepository],
  // providers: [PlacesService,JsonStorageService],
})
export class PlacesModule {}
