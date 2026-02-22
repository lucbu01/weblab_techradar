import { ApiProperty } from '@nestjs/swagger';
import {
  Technology,
  TechnologyCategory,
  TechnologyRing,
} from '@techradar/libs';

export const TECHNOLOGY_CATEGORIES = [
  'TECHNIQUES',
  'TOOLS',
  'PLATFORMS',
  'LANGS_FRAMEWORKS',
] as const;

export const TECHNOLOGY_RINGS = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'] as const;

export class TechnologyDto implements Technology {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  publishedAt?: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'boolean' })
  published: boolean;

  @ApiProperty({
    enum: TECHNOLOGY_CATEGORIES,
  })
  category: TechnologyCategory;

  @ApiProperty({ enum: TECHNOLOGY_RINGS })
  ring?: TechnologyRing;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string' })
  classificationDescription?: string;
}
