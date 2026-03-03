import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnologyDetail } from './technology-detail';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Auth } from '../auth/auth';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TechnologyDetail', () => {
  let component: TechnologyDetail;
  let fixture: ComponentFixture<TechnologyDetail>;
  let authMock;

  beforeEach(async () => {
    authMock = {
      getUserInfo: vi.fn().mockReturnValue(of({ appRoles: [] })),
      authorize: vi.fn(),
      logoff: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [TechnologyDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: 'id' } },
        { provide: Auth, useValue: authMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
