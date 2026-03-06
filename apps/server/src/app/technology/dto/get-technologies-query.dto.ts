import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  TECHNOLOGY_CATEGORIES,
  TECHNOLOGY_RINGS,
  TechnologyCategory,
  TechnologyRing,
} from '@techradar/libs';
import { Transform } from 'class-transformer';

export class GetTechnologiesQueryDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    enum: TECHNOLOGY_CATEGORIES,
    isArray: true,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsEnum(TECHNOLOGY_CATEGORIES, { each: true })
  @IsOptional()
  category?: TechnologyCategory[];

  @ApiPropertyOptional({
    enum: TECHNOLOGY_RINGS,
    isArray: true,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsEnum(TECHNOLOGY_RINGS, { each: true })
  @IsOptional()
  ring?: TechnologyRing[];

  @ApiPropertyOptional({
    type: 'boolean',
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiPropertyOptional({
    enum: ['name', 'category', 'ring'],
  })
  @IsEnum(['name', 'category', 'ring'])
  @IsOptional()
  sortColumn?: 'name' | 'category' | 'ring';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortDirection?: 'asc' | 'desc';
}
