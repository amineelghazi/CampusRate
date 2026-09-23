import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Create a new review for a specific place' })
  @ApiResponse({ status: 201, description: 'The review has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
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

  @ApiOperation({ summary: 'Get all reviews for a specific place' })
  @ApiResponse({ status: 200, description: 'List of reviews retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Place not found.' })
  @Get('places/:placeId/reviews')
  findAllForPlace(@Param('placeId') placeId: string) {
    return this.reviewsService.findAllForPlace(placeId).then((data) => ({ data }));
  }

  @ApiOperation({ summary: 'Get a specific review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @Get('reviews/:id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a specific review by ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @Patch('reviews/:id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a specific review by ID' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @Delete('reviews/:id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
  }
}