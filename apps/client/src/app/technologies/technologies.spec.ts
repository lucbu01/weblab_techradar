import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Technologies } from './technologies';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

describe('Technologies', () => {
  let component: Technologies;
  let fixture: ComponentFixture<Technologies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Technologies],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialog,
          useValue: {
            open: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Technologies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
