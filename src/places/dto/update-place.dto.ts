import { ArrayUnique, IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PlaceCategory } from '../enums/place-category.enum';
import { PlaceStatus } from '../enums/place-status.enum';

export class UpdatePlaceDto {
  @IsOptional() @IsString() @MinLength(1)
  name?: string;

  @IsOptional() @IsString() @MinLength(1)
  description?: string;

  @IsOptional() @IsEnum(PlaceCategory)
  category?: PlaceCategory;

  @IsOptional() @IsString() @MinLength(1)
  address?: string;

  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true })
  services?: string[];

  @IsOptional() @IsEnum(PlaceStatus)
  status?: PlaceStatus;
}