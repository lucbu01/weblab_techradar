import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { Auth } from '../auth/auth';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let authMock;

  beforeEach(async () => {
    authMock = {
      getUserInfo: () => of({ appRoles: [] }),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: Auth, useValue: authMock }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
