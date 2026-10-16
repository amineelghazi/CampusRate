import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './schemas/review.schema';
import { Place, PlaceSchema } from '../places/schemas/place.schema';
import { Review } from './schemas/review.schema';
import { ReviewsRepository } from './reviews.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema},
      { name: Place.name, schema : PlaceSchema},
    ])
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
