import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { TechnologyCategory, TechnologyRing } from '@techradar/libs';

const TECHNOLOGY_CATEGORIES = [
  'TECHNIQUES',
  'TOOLS',
  'PLATFORMS',
  'LANGS_FRAMEWORKS',
] as const;

const TECHNOLOGY_RINGS = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'] as const;

export class CreateTechnologyDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must not be blank' })
  name: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  published: boolean;

  @ApiProperty({ required: true, enum: TECHNOLOGY_CATEGORIES })
  @IsIn(TECHNOLOGY_CATEGORIES)
  category: TechnologyCategory;

  @ApiProperty({
    required: false,
    enum: TECHNOLOGY_RINGS,
    description: 'Required when published=true',
  })
  @ValidateIf((o: CreateTechnologyDto) => o.published === true)
  @IsIn(TECHNOLOGY_RINGS)
  ring?: TechnologyRing;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'description must not be blank' })
  description: string;

  @ApiProperty({
    required: false,
    description: 'Required when published=true',
  })
  @ValidateIf((o: CreateTechnologyDto) => o.published === true)
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'classificationDescription must not be blank' })
  classificationDescription?: string;
}
