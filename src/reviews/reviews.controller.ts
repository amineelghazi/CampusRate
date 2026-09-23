import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('places/:placeId/reviews')
  @HttpCode(201)
  async create(
    @Param('placeId') placeId: string,
    @Body() dto: CreateReviewDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const review = await this.reviewsService.create(placeId, dto);
    res.setHeader('Location', `/api/v1/reviews/${review.id}`);
    return review;
  }

  @Get('places/:placeId/reviews')
  findAllForPlace(@Param('placeId') placeId: string) {
    return this.reviewsService.findAllForPlace(placeId).then((data) => ({ data }));
  }

  @Get('reviews/:id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch('reviews/:id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @Delete('reviews/:id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
  }
}