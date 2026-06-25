import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AdminLogin } from './admin-login';
import { AdminService } from './admin-service';

describe('AdminLogin', () => {
  let component: AdminLogin;
  let fixture: ComponentFixture<AdminLogin>;
  let adminServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    adminServiceSpy = {
      getAdmins: vi.fn(),
      updateAdmin: vi.fn(),
      setAuthenticated: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminLogin],
      providers: [
        provideRouter([]),
        {
          provide: AdminService,
          useValue: adminServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLogin);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open reset form', () => {
    component.openResetForm();

    expect(component.showResetForm).toBe(true);
  });

  it('should cancel reset form and clear fields', () => {
    component.showResetForm = true;
    component.resetUsername = 'bharath';
    component.currentPassword = '123';
    component.newPassword = '456';

    component.cancelReset();

    expect(component.showResetForm).toBe(false);
    expect(component.resetUsername).toBe('');
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
  });

  it('should show alert for invalid login', () => {
    adminServiceSpy.getAdmins.mockReturnValue(of([]));

    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.username = 'bharath';
    component.password = '123';

    component.login();

    expect(alertSpy).toHaveBeenCalledWith(
      'Invalid Username or Password'
    );
  });

  it('should login successfully', () => {
    const users = [
      {
        id: 1,
        userName: 'bharath',
        passWord: '123',
      },
    ];

    adminServiceSpy.getAdmins.mockReturnValue(of(users));

    component.username = 'bharath';
    component.password = '123';

    component.login();

    expect(adminServiceSpy.setAuthenticated).toHaveBeenCalledWith(
      true
    );
  });

  it('should show alert when reset credentials are invalid', () => {
    adminServiceSpy.getAdmins.mockReturnValue(of([]));

    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.resetUsername = 'bharath';
    component.currentPassword = '123';

    component.updatePassword();

    expect(alertSpy).toHaveBeenCalledWith(
      'Invalid Username or Current Password'
    );
  });

  it('should show alert when password change is not allowed', () => {
    const users = [
      {
        id: 1,
        userName: 'bharath',
        passWord: '123',
        firstLogin: false,
      },
    ];

    adminServiceSpy.getAdmins.mockReturnValue(of(users));

    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.resetUsername = 'bharath';
    component.currentPassword = '123';

    component.updatePassword();

    expect(alertSpy).toHaveBeenCalledWith(
      'Password change not allowed'
    );
  });

  it('should update password successfully', () => {
    const user = {
      id: 1,
      userName: 'bharath',
      passWord: '123',
      firstLogin: true,
    };

    adminServiceSpy.getAdmins.mockReturnValue(of([user]));
    adminServiceSpy.updateAdmin.mockReturnValue(of({}));

    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.resetUsername = 'bharath';
    component.currentPassword = '123';
    component.newPassword = '456';

    component.updatePassword();

    expect(adminServiceSpy.updateAdmin).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'Password Updated Successfully'
    );
  });
});