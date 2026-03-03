import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ring } from './ring';

describe('Ring', () => {
  let component: Ring;
  let fixture: ComponentFixture<Ring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ring],
    }).compileComponents();

    fixture = TestBed.createComponent(Ring);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
