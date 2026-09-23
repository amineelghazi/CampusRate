import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreatePlaceDto } from './dto/create-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlacesService } from './places.service';
import { ApiTags,ApiOperation,ApiParam,ApiResponse, } from '@nestjs/swagger';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @ApiOperation({ summary: 'Create a new place' })
  @ApiResponse({ status: 201, description: 'The place has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Conflict. A place with the same name already exists.' })
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePlaceDto, @Res({ passthrough: true }) res: Response) {
    const place = await this.placesService.create(dto);
    res.setHeader('Location', `/api/v1/places/${place.id}`);
    return place;
  }

  @ApiOperation({ summary: 'Get a list of places' })
  @ApiResponse({ status: 200, description: 'List of places retrieved successfully.' })
  @Get()
  findAll(@Query() query: QueryPlacesDto) {
    return this.placesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a specific place by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the place to retrieve', example: 'plc_12345678-1234-1234-1234-1234567890ab' })
  @ApiResponse({ status: 200, description: 'Place retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Place not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a specific place by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the place to update', example: 'plc_12345678-1234-1234-1234-1234567890ab' })
  @ApiResponse({ status: 200, description: 'Place updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Place not found.' })
  @ApiResponse({ status: 409, description: 'Conflict. A place with the same name already exists.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.placesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a specific place by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the place to delete', example: 'plc_12345678-1234-1234-1234-1234567890ab' })
  @ApiResponse({ status: 204, description: 'Place deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Place not found.' })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.placesService.remove(id);
  }
}