import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Viewer } from './viewer';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TechnologyService } from '../technology.service';
import { vi } from 'vitest';

describe('Viewer', () => {
  let component: Viewer;
  let fixture: ComponentFixture<Viewer>;
  let technologyServiceMock: any;
  let dialogMock: any;

  const mockTechs = [
    { id: '1', name: 'Tech 1', ring: 'ADOPT', category: 'TOOLS' },
  ];

  beforeEach(async () => {
    technologyServiceMock = {
      getTechnologies: vi.fn().mockReturnValue(of(mockTechs)),
    };
    dialogMock = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(true),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [Viewer],
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
          useValue: dialogMock,
        },
        {
          provide: TechnologyService,
          useValue: technologyServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load technologies on init', () => {
    expect(technologyServiceMock.getTechnologies).toHaveBeenCalledWith(true);
    expect(component.technologies()).toEqual(mockTechs as any);
  });

  it('should calculate points correctly', () => {
    const point = component.getPoint(mockTechs[0] as any);
    expect(point.x).toBeDefined();
    expect(point.y).toBeDefined();
    // Center is 400, radius for ADOPT is 40. x should be 400 + 40 * cos(angle)
    expect(point.x).toBeGreaterThan(300);
    expect(point.x).toBeLessThan(500);
  });

  it('should open add technology dialog', async () => {
    await component.addTechnology();
    expect(dialogMock.open).toHaveBeenCalled();
  });
});
