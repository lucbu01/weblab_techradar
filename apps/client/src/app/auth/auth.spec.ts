import { TestBed } from '@angular/core/testing';

import { Auth } from './auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  AutoLoginPartialRoutesGuard,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: OidcSecurityService,
          useValue: {
            checkAuth: () => of({ isAuthenticated: false }),
          },
        },
        {
          provide: AutoLoginPartialRoutesGuard,
          useValue: {
            canActivate: () => of(true),
          },
        },
      ],
    });
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
