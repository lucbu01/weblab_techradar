import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnologyDetail } from './technology-detail';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Auth } from '../auth/auth';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TechnologyService } from '../technology.service';
import { vi } from 'vitest';

describe('TechnologyDetail', () => {
  let component: TechnologyDetail;
  let fixture: ComponentFixture<TechnologyDetail>;
  let authMock: any;
  let technologyServiceMock: any;
  let dialogMock: any;

  const mockTech = {
    id: '123',
    name: 'Test Tech',
    category: 'TOOLS',
    ring: 'ADOPT',
    description: 'Desc',
    classificationDescription: 'Class Desc',
    published: true,
  };

  beforeEach(async () => {
    authMock = {
      getUserInfo: vi.fn().mockReturnValue(of({ appRoles: ['admin'] })),
    };
    technologyServiceMock = {
      getTechnologyById: vi.fn().mockReturnValue(of(mockTech)),
    };
    dialogMock = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(mockTech),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: '123' } },
        { provide: Auth, useValue: authMock },
        { provide: TechnologyService, useValue: technologyServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load technology on init', () => {
    expect(technologyServiceMock.getTechnologyById).toHaveBeenCalledWith('123');
    expect(component['technology']()).toEqual(mockTech as any);
  });

  it('should open edit dialog and update technology', async () => {
    await component.openEditDialog('edit');
    expect(dialogMock.open).toHaveBeenCalled();
    expect(component['technology']()).toEqual(mockTech as any);
  });
});
