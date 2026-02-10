import { ApiProperty } from '@nestjs/swagger';
import { Environment } from '@techradar/libs';

export class EnvironmentDto implements Environment {
  @ApiProperty({ type: 'string' })
  oidcAudience: string;
  @ApiProperty({ type: 'string' })
  oidcClient: string;
  @ApiProperty({ type: 'string' })
  oidcIssuer: string;
}
