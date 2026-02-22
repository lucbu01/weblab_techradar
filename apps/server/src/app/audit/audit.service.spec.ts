import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getModelToken } from '@nestjs/mongoose';
import { AdminLoginAudit } from './admin-login-audit.schema';

describe('AuditService', () => {
  let service: AuditService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getModelToken(AdminLoginAudit.name),
          useValue: {
            updateOne: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    model = module.get(getModelToken(AdminLoginAudit.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordAdminLoginIfNeeded', () => {
    it('should record login for CTO', async () => {
      const user = {
        sub: 'user-1',
        iat: 12345,
        roles: ['CTO'],
        preferred_username: 'cto-user',
      };
      await service.recordAdminLoginIfNeeded({
        user,
        ip: '1.2.3.4',
        userAgent: 'test-agent',
      });

      expect(model.updateOne).toHaveBeenCalledWith(
        { sub: 'user-1', iat: 12345 },
        expect.objectContaining({
          $setOnInsert: expect.objectContaining({
            sub: 'user-1',
            iat: 12345,
            roles: ['CTO'],
            username: 'cto-user',
            ip: '1.2.3.4',
            userAgent: 'test-agent',
          }),
        }),
        { upsert: true },
      );
    });

    it('should NOT record login for EMPLOYEE', async () => {
      const user = { sub: 'user-2', iat: 67890, roles: ['EMPLOYEE'] };
      await service.recordAdminLoginIfNeeded({ user });

      expect(model.updateOne).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all audit entries sorted by date', async () => {
      const mockResult = [{ sub: '1' }, { sub: '2' }];
      model.exec.mockResolvedValue(mockResult);

      const result = await service.findAll();

      expect(model.find).toHaveBeenCalled();
      expect(model.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockResult);
    });
  });
});
