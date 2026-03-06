import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import {
  AutoLoginPartialRoutesGuard,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { Env } from '../env/env';
import { vi } from 'vitest';

describe('Auth', () => {
  let service: Auth;
  let oidcSecurityServiceMock: any;
  let oidcGuardMock: any;
  let routerMock: any;
  let envMock: any;

  const mockTokenPayload = {
    preferred_username: 'jdoe',
    name: 'John Doe',
    given_name: 'John',
    family_name: 'Doe',
    email: 'john@example.com',
    email_verified: true,
    'allowed-origins': ['*'],
    resource_access: {
      'techradar-api': {
        roles: ['ADMIN', 'USER'],
      },
    },
    locale: 'de',
  };

  beforeEach(() => {
    oidcSecurityServiceMock = {
      checkAuth: vi.fn().mockReturnValue(of({ isAuthenticated: true })),
      isAuthenticated$: new BehaviorSubject({ isAuthenticated: true }),
      getPayloadFromAccessToken: vi.fn().mockReturnValue(of(mockTokenPayload)),
      logoff: vi.fn().mockReturnValue(of(null)),
      authorize: vi.fn(),
    };

    oidcGuardMock = {
      canActivate: vi.fn().mockReturnValue(of(true)),
    };

    routerMock = {
      createUrlTree: vi.fn().mockReturnValue('/mock-url-tree'),
      navigate: vi.fn(),
    };

    envMock = {
      environmentLoaded: of({ oidcAudience: 'techradar-api' }),
    };

    TestBed.configureTestingModule({
      providers: [
        Auth,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OidcSecurityService, useValue: oidcSecurityServiceMock },
        { provide: AutoLoginPartialRoutesGuard, useValue: oidcGuardMock },
        { provide: Router, useValue: routerMock },
        { provide: Env, useValue: envMock },
      ],
    });
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true if oidcGuard allows and no roles are required', async () => {
      const route = { data: {} } as any;
      const state = {} as any;

      const result = await firstValueFrom(service.canActivate(route, state));
      expect(result).toBe(true);
    });

    it('should return true if user has required role', async () => {
      const route = { data: { roles: ['ADMIN'] } } as any;
      const state = {} as any;

      const result = await firstValueFrom(service.canActivate(route, state));
      expect(result).toBe(true);
    });

    it('should return UrlTree if user does not have required role', async () => {
      const route = { data: { roles: ['SUPERADMIN'] } } as any;
      const state = {} as any;

      const result = await firstValueFrom(service.canActivate(route, state));
      expect(result).toBe('/mock-url-tree');
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
    });

    it('should return false if oidcGuard denies access', async () => {
      oidcGuardMock.canActivate.mockReturnValue(of(false));
      const route = { data: {} } as any;
      const state = {} as any;

      const result = await firstValueFrom(service.canActivate(route, state));
      expect(result).toBe(false);
    });
  });

  describe('getUserInfo', () => {
    it('should return mapped user info', async () => {
      const userInfo = await firstValueFrom(service.getUserInfo());
      expect(userInfo.username).toBe('jdoe');
      expect(userInfo.appRoles).toContain('ADMIN');
      expect(userInfo.appRoles).toContain('USER');
      expect(userInfo.email).toBe('john@example.com');
    });

    it('should handle missing roles gracefully', async () => {
      oidcSecurityServiceMock.getPayloadFromAccessToken.mockReturnValue(of({}));
      const userInfo = await firstValueFrom(service.getUserInfo());
      expect(userInfo.appRoles).toEqual([]);
    });
  });

  it('should call logoff on oidcService', () => {
    service.logoff();
    expect(oidcSecurityServiceMock.logoff).toHaveBeenCalled();
  });

  it('should call authorize on oidcService', () => {
    service.authorize();
    expect(oidcSecurityServiceMock.authorize).toHaveBeenCalled();
  });
});
