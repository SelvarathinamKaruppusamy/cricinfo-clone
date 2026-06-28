import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { Profile } from './profile';
import { AdminService } from '../admin-login/admin-service';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  const adminServiceMock = {
    getCurrentUser: vi.fn(() => ({
      fname: 'Rithik',
      lname: 'T',
      email: 'ritthik@gmail.com',
      role: 'Admin',
    })),
    logout: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    component.ngOnInit();

    expect(component.user).toBeTruthy();
    expect(component.user.fname).toBe('Rithik');
  });

  it('should logout and navigate to admin page', () => {
    component.logout();

    expect(adminServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should navigate to signup page', () => {
    component.addadmin();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/navbarAdmin/signup',
    ]);
  });
});