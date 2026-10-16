import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from './schemas/place.schema';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';
import { PlaceCategory } from './enums/place-category.enum';

@Injectable()
export class PlacesRepository {
  constructor(@InjectModel(Place.name) private readonly model: Model<Place>) {}

  async create(dto: CreatePlaceDto) {
    return await this.model.create(dto);
  }

  async findAll(query: QueryPlacesDto) {
    const filter = query.category ? { category: query.category } : {};
    const itemsToSkip = (query.page - 1) * query.limit;

    return await this.model
      .find(filter)
      .sort({createdAt:1})
      .skip(itemsToSkip)
      .limit(query.limit)
      .exec();
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async count(category?: PlaceCategory) {
    return await this.model.countDocuments(category ? { category } : {}).exec();
  }

  async update(id: string, dto: UpdatePlaceDto) {
    return await this.model
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
