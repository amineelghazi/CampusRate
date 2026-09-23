import { ArrayUnique, IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PlaceCategory } from '../enums/place-category.enum';
import { PlaceStatus } from '../enums/place-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty({example: 'Library'})
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({example: 'A place to study and read books'})
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({example: 'LIBRARY'})
  @IsEnum(PlaceCategory)
  category: PlaceCategory;

  @ApiProperty({example: '123 Main Street'})
  @IsString()
  @MinLength(1)
  address: string;

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