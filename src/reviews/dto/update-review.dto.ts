import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional() @IsString() @MinLength(1)
  authorName?: string;
  
  @ApiPropertyOptional({ example: 5 })
  @IsOptional() @IsInt() @Min(1) @Max(5)
  rating?: number;
  
  @ApiPropertyOptional({ example: 'Great place to study!' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100)
  comment?: string;
}