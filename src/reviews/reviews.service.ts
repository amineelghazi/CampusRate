import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JsonStorageService } from '../storage/json-storage.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { PlacesRepository } from '../places/places.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Place } from '../places/schemas/place.schema';
import { Model } from 'mongoose';
import { stat } from 'node:fs';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly repository: ReviewsRepository,
    @InjectModel(Place.name) private readonly placeModel: Model<Place>,
  ) {}

  private async refreshStats(placeId: string) {
    const stats = await this.repository.getStats(placeId);
    await this.placeModel
      .updateOne(
        { _id: placeId },
        {
          averageRating:
            stats.avg === null ? null : Math.round(stats.avg * 100) / 100,
          reviewCount: stats.count,
        },
      )
      .exec();
  }

  async create(placeId: string, dto: CreateReviewDto) {
    const place = await this.placeModel.exists({ _id: placeId });
    if (!place) {
      throw new NotFoundException(`Place ${placeId} not found`);
    }

    const review = await this.repository.create(placeId, dto);
    await this.refreshStats(placeId);
    return review;
  }

  async findAllForPlace(placeId: string) {
    const place = await this.placeModel.exists({ _id: placeId });
    if (!place) {
      throw new NotFoundException(`Place ${placeId} not found`);
    }
    return await this.repository.findAllByPlace(placeId);
  }

  async findOne(id: string) {
    const review = await this.repository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return review;
  }

  async update(id: string, dto: UpdateReviewDto) {
    const review = await this.repository.update(id, dto);
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    await this.refreshStats(review.placeId);
    return review;
  }

  async remove(id: string) {
    const review = await this.repository.delete(id);
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    await this.refreshStats(review.placeId);
  }
}
