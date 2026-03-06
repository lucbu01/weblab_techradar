import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { AuditService } from './audit.service';
import { AdminLoginAuditDto } from './dto/audit.dto';

@ApiBearerAuth('keycloak')
@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({
    summary: 'Get all admin login audit entries',
    description: 'Role: `CTO`',
  })
  @ApiOkResponse({
    description: 'List of audit entries',
    type: [AdminLoginAuditDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth('CTO')
  @Get()
  async findAll(): Promise<AdminLoginAuditDto[]> {
    const audits = await this.auditService.findAll();
    return audits.map((a) => ({
      sub: a.sub,
      iat: a.iat,
      roles: a.roles,
      username: a.username,
      ip: a.ip,
      userAgent: a.userAgent,
      createdAt: a.createdAt?.toISOString(),
    }));
  }
}
