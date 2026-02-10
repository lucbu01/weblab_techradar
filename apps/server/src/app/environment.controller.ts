import { Controller, Get } from '@nestjs/common';
import { Environment } from '@techradar/libs';

@Controller('environment')
export class EnvironmentController {
  @Get()
  getData(): Environment {
    return {
      oidcIssuer: process.env.OIDC_ISSUER,
      oidcAudience: process.env.OIDC_AUDIENCE,
      oidcClient: process.env.OIDC_CLIENT,
    };
  }
}
