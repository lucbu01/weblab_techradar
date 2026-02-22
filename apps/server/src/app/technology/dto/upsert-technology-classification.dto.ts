import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { TechnologyRing } from '@techradar/libs';
import { TECHNOLOGY_RINGS } from './technology.dto';

export class UpsertTechnologyClassificationDto {
  @ApiProperty({ required: true, enum: TECHNOLOGY_RINGS })
  @IsIn(TECHNOLOGY_RINGS)
  ring: TechnologyRing;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'classificationDescription must not be blank' })
  classificationDescription: string;
}
