import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JsonStorageService } from '../storage/json-storage.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceStatus } from './enums/place-status.enum';

@Injectable()
export class PlacesService {
  constructor(private readonly storage: JsonStorageService) {}

  private addRating(place: any, reviews: any[]) {
    const placeReviews = reviews.filter((r) => r.placeId === place.id);

    if (placeReviews.length === 0) {
      return { ...place, averageRating: null, reviewCount: 0 };
    }

    let total = 0;
    for (const review of placeReviews) {
      total += review.rating;
    }
    const average = Math.round((total / placeReviews.length) * 100) / 100;

    return { ...place, averageRating: average, reviewCount: placeReviews.length };
  }

  async create(dto: CreatePlaceDto) {
    const data = await this.storage.read();
    const now = new Date().toISOString();

    const newPlace = {
      id: `plc_${randomUUID()}`,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      address: dto.address,
      services: dto.services ?? [],
      status: dto.status ?? PlaceStatus.ACTIVE,
      averageRating: null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    data.places.push(newPlace);
    await this.storage.write(data);
    return newPlace;
  }

  async findAll(query: QueryPlacesDto) {
    const data = await this.storage.read();

    // 1. filter by category
    let places = data.places;
    if (query.category) {
      places = places.filter((p:any) => p.category === query.category);
    }

    // 2. paginate
    const totalItems = places.length;
    const start = (query.page - 1) * query.limit;
    const pageOfPlaces = places.slice(start, start + query.limit);

    // 3. add the rating to each place
    const result = pageOfPlaces.map((p:any) => this.addRating(p, data.reviews));

    return {
      data: result,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / query.limit),
      },
    };
  }

  async findOne(id: string) {
    const data = await this.storage.read();
    const place = data.places.find((p:any) => p.id === id);

    if (!place) {
      throw new NotFoundException(`Place ${id} not found`);
    }
    return this.addRating(place, data.reviews);
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const data = await this.storage.read();
    const index = data.places.findIndex((p:any) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Place ${id} not found`);
    }

    const updatedPlace = {
      ...data.places[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    data.places[index] = updatedPlace;
    await this.storage.write(data);
    return this.addRating(updatedPlace, data.reviews);
  }

  async remove(id: string) {
    const data = await this.storage.read();
    const index = data.places.findIndex((p:any) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Place ${id} not found`);
    }

    const hasReviews = data.reviews.some((r:any) => r.placeId === id);
    if (hasReviews) {
      throw new ConflictException(`Place ${id} has reviews and cannot be deleted`);
    }

    data.places.splice(index, 1);
    await this.storage.write(data);
  }
}