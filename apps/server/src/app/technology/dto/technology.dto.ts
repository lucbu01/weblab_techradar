import { ApiProperty } from '@nestjs/swagger';
import {
  Technology,
  TechnologyCategory,
  TechnologyRing,
} from '@techradar/libs';

export class TechnologyDto implements Technology {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  publishedAt: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'boolean' })
  published: boolean;

  @ApiProperty({
    enum: ['TECHNIQUES', 'TOOLS', 'PLATFORMS', 'LANGS_FRAMEWORKS'],
  })
  category: TechnologyCategory;

  @ApiProperty({ enum: ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'] })
  ring: TechnologyRing;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string' })
  classificationDescription: string;
}
