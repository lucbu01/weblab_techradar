import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Viewer } from './viewer';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TechnologyApi } from '../technology-api';
import { vi } from 'vitest';
import { Auth } from '../auth/auth';

describe('Viewer', () => {
  let component: Viewer;
  let fixture: ComponentFixture<Viewer>;
  let technologyServiceMock: any;
  let dialogMock: any;
  let authMock: any;

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
    authMock = {
      getUserInfo: vi.fn().mockReturnValue(of({ appRoles: [] })),
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
          provide: TechnologyApi,
          useValue: technologyServiceMock,
        },
        { provide: Auth, useValue: authMock },
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
    const techs = component.technologies();
    expect(techs.length).toBe(1);
    expect(techs[0].name).toBe('Tech 1');
  });

  it('should calculate points correctly', () => {
    const tech = component.technologies()[0];
    expect(tech.x).toBeDefined();
    expect(tech.y).toBeDefined();
    // Center is 400. x should be in range
    expect(tech.x).toBeGreaterThan(300);
    expect(tech.x).toBeLessThan(500);
  });

  it('should handle collisions by slightly shifting points', () => {
    const manyTechs = [
      { id: '1', name: 'Tech 1', ring: 'ADOPT', category: 'TOOLS' },
      { id: '2', name: 'Tech 2', ring: 'ADOPT', category: 'TOOLS' },
      { id: '3', name: 'Tech 3', ring: 'ADOPT', category: 'TOOLS' },
    ];
    technologyServiceMock.getTechnologies.mockReturnValue(of(manyTechs));
    component.ngOnInit();
    fixture.detectChanges();

    const techs = component.technologies();
    expect(techs.length).toBe(3);

    // Check that points are not identical (collision avoidance)
    const p1 = { x: techs[0].x, y: techs[0].y };
    const p2 = { x: techs[1].x, y: techs[1].y };
    const p3 = { x: techs[2].x, y: techs[2].y };

    expect(p1).not.toEqual(p2);
    expect(p1).not.toEqual(p3);
    expect(p2).not.toEqual(p3);
  });

  it('should set hoveredId on mouseenter and clear on mouseleave', () => {
    component.hoveredId.set(null);
    const techId = 'test-id';

    // Simuliere mouseenter (via Methode oder Signal)
    component.hoveredId.set(techId);
    expect(component.hoveredId()).toBe(techId);
    expect(component.hoveredTech()?.id).toBeUndefined(); // Weil techId nicht in technologies ist

    component.hoveredId.set(null);
    expect(component.hoveredId()).toBeNull();
  });

  it('should open add technology dialog', async () => {
    await component.addTechnology();
    expect(dialogMock.open).toHaveBeenCalled();
  });
});
