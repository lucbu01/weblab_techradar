import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Viewer } from './viewer';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Viewer', () => {
  let component: Viewer;
  let fixture: ComponentFixture<Viewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewer],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
