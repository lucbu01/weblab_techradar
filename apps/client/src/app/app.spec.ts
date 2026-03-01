import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Auth } from './auth/auth';
import { of } from 'rxjs';

import { vi } from 'vitest';

describe('App', () => {
  let authMock: any;

  beforeEach(async () => {
    authMock = {
      getUserInfo: vi.fn().mockReturnValue(of({ appRoles: [] })),
      authorize: vi.fn(),
      logoff: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Auth, useValue: authMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
