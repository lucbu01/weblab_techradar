import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AdminLoginAuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    return next.handle().pipe(
      tap({
        next: () => {
          void this.auditService.recordAdminLoginIfNeeded({
            user: req.user ?? {},
            ip: req.ip,
            userAgent: req.get?.('user-agent'),
          });
        },
      }),
    );
  }
}
