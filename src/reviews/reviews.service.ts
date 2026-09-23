import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JsonStorageService } from '../storage/json-storage.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly storage: JsonStorageService) {}

  async create(placeId: string, dto: CreateReviewDto) {
    const data = await this.storage.read();

    const place = data.places.find((p: any) => p.id === placeId);
    if (!place) {
      throw new NotFoundException(`Place ${placeId} not found`);
    }

    const now = new Date().toISOString();
    const newReview = {
      id: `rev_${randomUUID()}`,
      placeId,
      authorName: dto.authorName,
      rating: dto.rating,
      comment: dto.comment,
      createdAt: now,
      updatedAt: now,
    };

    data.reviews.push(newReview);
    await this.storage.write(data);
    return newReview;
  }

  async findAllForPlace(placeId: string) {
    const data = await this.storage.read();

    const place = data.places.find((p: any) => p.id === placeId);
    if (!place) {
      throw new NotFoundException(`Place ${placeId} not found`);
    }

    return data.reviews.filter((r: any) => r.placeId === placeId);
  }

  async findOne(id: string) {
    const data = await this.storage.read();
    const review = data.reviews.find((r: any) => r.id === id);

    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return review;
  }

  async update(id: string, dto: UpdateReviewDto) {
    const data = await this.storage.read();
    const index = data.reviews.findIndex((r: any) => r.id === id);

    if (index === -1) {
      throw new NotFoundException(`Review ${id} not found`);
    }

    data.reviews[index] = {
      ...data.reviews[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await this.storage.write(data);
    return data.reviews[index];
  }

  async remove(id: string) {
    const data = await this.storage.read();
    const index = data.reviews.findIndex((r: any) => r.id === id);

    if (index === -1) {
      throw new NotFoundException(`Review ${id} not found`);
    }

    data.reviews.splice(index, 1);
    await this.storage.write(data);
  }
}