import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Technologies } from './technologies';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { TechnologyApi } from '../technology-api';
import { of } from 'rxjs';

import { vi } from 'vitest';
import { Auth } from '../auth/auth';

describe('Technologies', () => {
  let component: Technologies;
  let fixture: ComponentFixture<Technologies>;
  let technologyService: TechnologyApi;
  let authMock;

  const mockTechnologies = [
    { id: '1', name: 'Tech 1', category: 'LANGS_FRAMEWORKS', ring: 'ADOPT' },
    { id: '2', name: 'Tech 2', category: 'TOOLS', ring: 'TRIAL' },
  ];

  beforeEach(async () => {
    authMock = {
      getUserInfo: vi.fn().mockReturnValue(of({ appRoles: [] })),
    };
    await TestBed.configureTestingModule({
      imports: [Technologies],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialog,
          useValue: {
            open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
          },
        },
        {
          provide: TechnologyApi,
          useValue: {
            getTechnologies: vi.fn().mockReturnValue(of(mockTechnologies)),
            deleteTechnology: vi.fn().mockReturnValue(of(null)),
          },
        },
        { provide: Auth, useValue: authMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Technologies);
    component = fixture.componentInstance;
    technologyService = TestBed.inject(TechnologyApi);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load technologies on init', () => {
    component.ngOnInit();
    expect(technologyService.getTechnologies).toHaveBeenCalled();
    expect(component['technologies']()).toEqual(mockTechnologies as any);
  });

  it('should call deleteTechnology and reload', () => {
    const tech = mockTechnologies[0];
    component.deleteTechnology(tech as any);
    expect(technologyService.deleteTechnology).toHaveBeenCalledWith(tech.id);
    expect(technologyService.getTechnologies).toHaveBeenCalled();
  });

  it('should open add technology dialog', async () => {
    const dialog = TestBed.inject(MatDialog);
    await component.addTechnology();
    expect(dialog.open).toHaveBeenCalled();
  });
});
