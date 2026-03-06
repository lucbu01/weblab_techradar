import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnologyEdit } from './technology-edit';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TechnologyApi } from '../technology-api';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

describe('TechnologyEdit', () => {
  let component: TechnologyEdit;
  let fixture: ComponentFixture<TechnologyEdit>;
  let technologyServiceMock: any;
  let dialogRefMock: any;
  let snackBarMock: any;

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
    technologyServiceMock = {
      getTechnologyById: vi.fn().mockReturnValue(of(mockTech)),
      createTechnology: vi.fn().mockReturnValue(of(mockTech)),
      updateTechnology: vi.fn().mockReturnValue(of(mockTech)),
      publishTechnology: vi.fn().mockReturnValue(of(mockTech)),
      upsertTechnologyClassification: vi.fn().mockReturnValue(of(mockTech)),
    };
    dialogRefMock = {
      close: vi.fn(),
    };
    snackBarMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyEdit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: '123', mode: 'edit' } },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TechnologyApi, useValue: technologyServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with technology data in edit mode', () => {
    const form = component['formGroup']();
    expect(form.get('name')?.value).toBe(mockTech.name);
    expect(form.get('category')?.value).toBe(mockTech.category);
  });

  it('should call updateTechnology on submit in edit mode', () => {
    component['onSubmit']({} as any);
    expect(technologyServiceMock.updateTechnology).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockTech);
    expect(snackBarMock.open).toHaveBeenCalled();
  });

  it('should call createTechnology on submit in create mode', async () => {
    // Reconfigure for create mode
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TechnologyEdit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' } },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TechnologyApi, useValue: technologyServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechnologyEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['onSubmit']({
      submitter: { getAttribute: () => 'publish' },
    } as any);
    expect(technologyServiceMock.createTechnology).toHaveBeenCalled();
  });

  it('should validate form in publish mode', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TechnologyEdit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: '123', mode: 'publish' } },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TechnologyApi, useValue: technologyServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechnologyEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component['formGroup']();
    // In publish mode, name/category/description are not in the form but ring/classificationDescription are
    expect(form.get('name')).toBeNull();
    expect(form.get('ring')).toBeDefined();

    form.patchValue({ ring: '', classificationDescription: '' });
    expect(form.valid).toBeFalsy();

    form.patchValue({ ring: 'ADOPT', classificationDescription: 'Valid desc' });
    expect(form.valid).toBeTruthy();
  });

  it('should call publishTechnology on submit in publish mode', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TechnologyEdit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: '123', mode: 'publish' } },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TechnologyApi, useValue: technologyServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechnologyEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component['onSubmit']({} as any);
    expect(technologyServiceMock.publishTechnology).toHaveBeenCalledWith(
      '123',
      expect.anything(),
    );
  });

  it('should call upsertTechnologyClassification on submit in classify mode', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TechnologyEdit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: '123', mode: 'classify' } },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TechnologyApi, useValue: technologyServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechnologyEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component['onSubmit']({} as any);
    expect(
      technologyServiceMock.upsertTechnologyClassification,
    ).toHaveBeenCalledWith('123', expect.anything());
  });
});
