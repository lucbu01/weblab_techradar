import { Controller, Get } from '@nestjs/common';
import { Environment } from '@techradar/libs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnvironmentDto } from './dto/environment.dto';

@ApiTags('environment')
@Controller('environment')
export class EnvironmentController {
  @ApiOperation({ summary: 'Get environment configuration' })
  @ApiOkResponse({
    description: 'Environment configuration',
    type: EnvironmentDto,
  })
  @Get()
  getData(): Environment {
    return {
      oidcIssuer: process.env.OIDC_ISSUER,
      oidcAudience: process.env.OIDC_AUDIENCE,
      oidcClient: process.env.OIDC_CLIENT,
    };
  }
}
