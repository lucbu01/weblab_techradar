import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminLoginAudit } from './admin-login-audit.schema';

type AuditedUser = {
  sub?: unknown;
  iat?: unknown;
  roles?: unknown;
  preferred_username?: unknown;
};

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AdminLoginAudit.name)
    private readonly auditModel: Model<AdminLoginAudit>,
  ) {}

  async recordAdminLoginIfNeeded(params: {
    user: AuditedUser;
    ip?: string;
    userAgent?: string;
  }): Promise<void> {
    const sub = typeof params.user?.sub === 'string' ? params.user.sub : null;
    const iat = typeof params.user?.iat === 'number' ? params.user.iat : null;

    const roles = Array.isArray(params.user?.roles)
      ? (params.user.roles.filter((r) => typeof r === 'string') as string[])
      : [];

    // Only log "administration logins": CTO / TECHLEAD
    const isAdmin = roles.includes('CTO') || roles.includes('TECHLEAD');
    if (!isAdmin) return;

    if (!sub || !iat) return;

    const username =
      typeof params.user?.preferred_username === 'string'
        ? params.user.preferred_username
        : undefined;

    await this.auditModel
      .updateOne(
        { sub, iat },
        {
          $setOnInsert: {
            sub,
            iat,
            roles,
            username,
            ip: params.ip,
            userAgent: params.userAgent,
            createdAt: new Date(),
          },
        },
        { upsert: true },
      )
      .exec();
  }

  async findAll(): Promise<AdminLoginAudit[]> {
    return this.auditModel.find().sort({ createdAt: -1 }).exec();
  }
}
