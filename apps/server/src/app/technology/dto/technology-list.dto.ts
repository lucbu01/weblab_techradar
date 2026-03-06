import { ApiProperty } from '@nestjs/swagger';
import {
  TECHNOLOGY_CATEGORIES,
  TECHNOLOGY_RINGS,
  TechnologyCategory,
  TechnologyList,
  TechnologyRing,
} from '@techradar/libs';

export class TechnologyListDto implements TechnologyList {
  @ApiProperty({ type: 'string' })
  id: string;

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
}
