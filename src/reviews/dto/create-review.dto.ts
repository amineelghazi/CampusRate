import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(1)
  authorName: string;
  
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great place to study!' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  comment: string;
}