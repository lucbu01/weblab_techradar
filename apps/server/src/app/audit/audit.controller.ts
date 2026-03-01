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
import { AdminLoginAudit } from './admin-login-audit.schema';

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
    type: [AdminLoginAudit],
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth('CTO')
  @Get()
  async findAll(): Promise<AdminLoginAudit[]> {
    return this.auditService.findAll();
  }
}
