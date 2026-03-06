import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  const createMockContext = (
    userRoles: string[] | undefined,
    handler: any = () => {
      // noop
    },
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: userRoles ? { roles: userRoles } : undefined,
        }),
      }),
      getHandler: () => handler,
      getClass: () => ({}),
    }) as any;

  describe('canActivate', () => {
    it('should allow access if no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      const context = createMockContext(['ANY_ROLE']);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access if required roles is an empty array', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
      const context = createMockContext(['ANY_ROLE']);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access if user has the required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
      const context = createMockContext(['ADMIN', 'USER']);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access if user has at least one of the required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(['ADMIN', 'EDITOR']);
      const context = createMockContext(['EDITOR']);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access if user does not have the required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
      const context = createMockContext(['USER']);

      expect(guard.canActivate(context)).toBe(false);
    });

    it('should deny access if user has no roles property', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {},
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as any;

      expect(guard.canActivate(context)).toBe(false);
    });

    it('should deny access if user is missing', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
      const context = createMockContext(undefined);

      expect(guard.canActivate(context)).toBe(false);
    });
  });
});
