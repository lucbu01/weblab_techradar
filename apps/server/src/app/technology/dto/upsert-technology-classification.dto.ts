import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  TECHNOLOGY_RINGS,
  TechnologyRing,
  UpsertTechnologyClassification,
} from '@techradar/libs';

export class UpsertTechnologyClassificationDto implements UpsertTechnologyClassification {
  @ApiProperty({ required: true, enum: TECHNOLOGY_RINGS })
  @IsIn(TECHNOLOGY_RINGS)
  ring: TechnologyRing;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'classificationDescription must not be blank' })
  classificationDescription: string;
}
