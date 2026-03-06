import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Technologies } from './technologies';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { TechnologyApi } from '../technology-api';
import { of } from 'rxjs';

import { vi } from 'vitest';
import { Auth } from '../auth/auth';
import { ActivatedRoute, Router } from '@angular/router';

describe('Technologies', () => {
  let component: Technologies;
  let fixture: ComponentFixture<Technologies>;
  let technologyService: TechnologyApi;
  let authMock: any;

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
          provide: ActivatedRoute,
          useValue: {
            fragment: of(null),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
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

  afterEach(() => {
    vi.useRealTimers();
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

  it('should filter technologies when search form changes', async () => {
    vi.useFakeTimers();
    component.ngOnInit();
    vi.advanceTimersByTime(10);

    component['searchForm'].patchValue({ name: 'TypeScript' });
    vi.advanceTimersByTime(400); // Wegen debounceTime(300)

    expect(technologyService.getTechnologies).toHaveBeenCalledWith(
      undefined,
      'TypeScript',
      null,
      null,
      undefined,
      undefined,
    );
    vi.useRealTimers();
  });

  it('should filter by published status', async () => {
    vi.useFakeTimers();
    component.ngOnInit();
    vi.advanceTimersByTime(10);

    component['searchForm'].patchValue({ published: 'true' as any });
    vi.advanceTimersByTime(400);

    expect(technologyService.getTechnologies).toHaveBeenCalledWith(
      'true' as any,
      undefined,
      null,
      null,
      undefined,
      undefined,
    );
    vi.useRealTimers();
  });

  it('should call getTechnologies with sort parameters', async () => {
    vi.useFakeTimers();
    component.ngOnInit();
    vi.advanceTimersByTime(10);

    component['sort'].next({ active: 'name', direction: 'asc' });
    vi.advanceTimersByTime(400);

    expect(technologyService.getTechnologies).toHaveBeenCalledWith(
      undefined,
      undefined,
      null,
      null,
      'name',
      'asc',
    );
    vi.useRealTimers();
  });

  it('should show add button only for CTO/TECHLEAD', () => {
    // Test for admin/CTO
    authMock.getUserInfo.mockReturnValue(of({ appRoles: ['CTO'] }));
    fixture = TestBed.createComponent(Technologies);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    expect(
      compiled.querySelector('[matTooltip="Technologie erstellen"]'),
    ).toBeTruthy();

    // Test for employee
    authMock.getUserInfo.mockReturnValue(of({ appRoles: ['EMPLOYEE'] }));
    fixture = TestBed.createComponent(Technologies);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    expect(
      compiled.querySelector('[matTooltip="Technologie erstellen"]'),
    ).toBeFalsy();
  });
});
