import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  TECHNOLOGY_CATEGORIES,
  TechnologyCategory,
  UpdateTechnology,
} from '@techradar/libs';

export class UpdateTechnologyDto implements UpdateTechnology {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must not be blank' })
  name: string;

  @ApiProperty({ required: true, enum: TECHNOLOGY_CATEGORIES })
  @IsIn(TECHNOLOGY_CATEGORIES)
  category: TechnologyCategory;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'description must not be blank' })
  description: string;
}
