import { ArrayUnique, IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PlaceCategory } from '../enums/place-category.enum';
import { PlaceStatus } from '../enums/place-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlaceDto {
  @ApiPropertyOptional({example: 'Library'})
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({example: 'A place to study and read books'})
  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @ApiPropertyOptional({example: 'LIBRARY'})
  @IsOptional()
  @IsEnum(PlaceCategory)
  category?: PlaceCategory;

  @ApiPropertyOptional({example: '123 Main Street'})
  @IsOptional()
  @IsString()
  @MinLength(1)
  address?: string;

  @ApiPropertyOptional({example: ['Wi-Fi', 'Parking']})
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({example: 'ACTIVE'})
  @IsOptional()
  @IsEnum(PlaceStatus)
  status?: PlaceStatus;
}