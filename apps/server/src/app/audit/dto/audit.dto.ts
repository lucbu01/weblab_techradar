import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginAuditDto {
  @ApiProperty({ type: 'string' })
  sub: string;

  @ApiProperty({ type: 'number' })
  iat: number;

  @ApiProperty({ type: 'string', isArray: true })
  roles: string[];

  @ApiProperty({ type: 'string' })
  username?: string;

  @ApiProperty({ type: 'string' })
  ip?: string;

  @ApiProperty({ type: 'string' })
  userAgent?: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: string;
}
