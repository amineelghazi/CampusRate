import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name) private readonly model: Model<Review>,
  ) {}

  async create(placeId: string, dto: CreateReviewDto) {
    return await this.model.create({ ...dto, placeId });
  }

  async findAllByPlace(placeId: string) {
    return await this.model.find({ placeId }).sort({ createdAt: 1 }).exec();
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async update(id: string, dto: UpdateReviewDto) {
    return await this.model
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async getStats(placeId: string) {
    const [stats] = await this.model.aggregate([
      { $match: { placeId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    return stats
      ? { avg: stats.avg as number, count: stats.count as number }
      : { avg: null, count: 0 };
  }
}
