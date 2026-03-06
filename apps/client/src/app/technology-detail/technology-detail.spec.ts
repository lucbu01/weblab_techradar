import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnologyDetail } from './technology-detail';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Auth } from '../auth/auth';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TechnologyApi } from '../technology-api';
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
      deleteTechnology: vi.fn(),
    };
    dialogMock = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(mockTech),
      }),
      closeAll: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: '123' } },
        { provide: Auth, useValue: authMock },
        { provide: TechnologyApi, useValue: technologyServiceMock },
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

  it('should show edit and delete buttons for CTO', () => {
    authMock.getUserInfo.mockReturnValue(of({ appRoles: ['CTO'] }));
    fixture = TestBed.createComponent(TechnologyDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    // Suche nach Text in den Buttons
    expect(compiled.textContent).toContain('Beschreibung ändern');
    expect(compiled.textContent).toContain('Löschen');
  });

  it('should NOT show edit and delete buttons for EMPLOYEE', () => {
    authMock.getUserInfo.mockReturnValue(of({ appRoles: ['EMPLOYEE'] }));
    fixture = TestBed.createComponent(TechnologyDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('Beschreibung ändern');
    expect(compiled.textContent).not.toContain('Löschen');
  });

  it('should show "Publizieren" button for unpublished technology', () => {
    const unpublishedTech = { ...mockTech, published: false };
    technologyServiceMock.getTechnologyById.mockReturnValue(
      of(unpublishedTech),
    );
    authMock.getUserInfo.mockReturnValue(of({ appRoles: ['CTO'] }));

    fixture = TestBed.createComponent(TechnologyDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Publizieren');
    expect(compiled.textContent).not.toContain('Einstufung ändern');
  });

  it('should call deleteTechnology and close dialog', () => {
    technologyServiceMock.deleteTechnology.mockReturnValue(of(null));
    authMock.getUserInfo.mockReturnValue(of({ appRoles: ['CTO'] }));
    fixture.detectChanges();

    component.deleteTechnology();

    expect(technologyServiceMock.deleteTechnology).toHaveBeenCalledWith('123');
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });
});
