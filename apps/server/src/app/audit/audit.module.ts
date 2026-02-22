import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  AdminLoginAudit,
  AdminLoginAuditSchema,
} from './admin-login-audit.schema';
import { AuditService } from './audit.service';
import { AdminLoginAuditInterceptor } from './admin-login-audit.interceptor';
import { AuditController } from './audit.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminLoginAudit.name, schema: AdminLoginAuditSchema },
    ]),
  ],
  controllers: [AuditController],
  providers: [
    AuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AdminLoginAuditInterceptor,
    },
  ],
})
export class AuditModule {}
