import { ArrayUnique, IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PlaceCategory } from '../enums/place-category.enum';
import { PlaceStatus } from '../enums/place-status.enum';

export class CreatePlaceDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsEnum(PlaceCategory)
  category: PlaceCategory;

  @IsString()
  @MinLength(1)
  address: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsEnum(PlaceStatus)
  status?: PlaceStatus;
}