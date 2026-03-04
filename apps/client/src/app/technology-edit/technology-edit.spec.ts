import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnologyEdit } from './technology-edit';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('TechnologyEdit', () => {
  let component: TechnologyEdit;
  let fixture: ComponentFixture<TechnologyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyEdit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { id: 'id' } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
