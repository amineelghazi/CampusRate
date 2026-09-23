import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreatePlaceDto } from './dto/create-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePlaceDto, @Res({ passthrough: true }) res: Response) {
    const place = await this.placesService.create(dto);
    res.setHeader('Location', `/api/v1/places/${place.id}`);
    return place;
  }

  @Get()
  findAll(@Query() query: QueryPlacesDto) {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.placesService.remove(id);
  }
}