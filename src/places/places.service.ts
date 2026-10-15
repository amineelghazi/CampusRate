import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlacesRepository } from './places.repository';

@Injectable()
export class PlacesService {
  constructor(private readonly repository: PlacesRepository) {}

  async create(dto: CreatePlaceDto) {
    return await this.repository.create(dto);
  }

  async findAll(query: QueryPlacesDto) {
    const data = await this.repository.findAll(query);
    const totalItems = await this.repository.count(query.category);

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / query.limit),
      },
    };
  }

  async findOne(id: string) {
    const place = await this.repository.findById(id);

    if (!place) {
      throw new NotFoundException(`Place ${id} not found`);
    }
    return place;
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const place = await this.repository.update(id, dto);

    if (!place) {
      throw new NotFoundException(`Place ${id} not found`);
    }
    return place;
  }

  async remove(id: string) {
    const place = await this.repository.findById(id);

    if (!place) {
      throw new NotFoundException(`Place ${id} not found`);
    }
    if (place.reviewCount > 0) {
      throw new ConflictException(
        `Place ${id} has reviews and cannot be deleted`,
      );
    }
    await this.repository.delete(id);
  }
}
