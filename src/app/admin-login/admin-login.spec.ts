import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AdminLogin } from './admin-login';
import { AdminService } from './admin-service';

describe('AdminLogin', () => {
  let component: AdminLogin;
  let fixture: ComponentFixture<AdminLogin>;
  let adminServiceSpy: any;

  beforeEach(async () => {
    adminServiceSpy = {
      getAdmins: vi.fn(),
      updateAdmin: vi.fn(),
      setAuthenticated: vi.fn(),
      setCurrentUser: vi.fn(), // important because login() calls this
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------
  // Reset form methods
  // ---------------------------

  it('should open reset form', () => {
    component.openResetForm();
    expect(component.showResetForm).toBe(true);
  });

  it('should cancel reset form and clear all fields', () => {
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

  // ---------------------------
  // Login
  // ---------------------------

  it('should show alert for invalid login', () => {
    adminServiceSpy.getAdmins.mockReturnValue(of([]));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.username = 'bharath';
    component.password = '123';

    component.login();

    expect(alertSpy).toHaveBeenCalledWith('Invalid Username or Password');
    expect(adminServiceSpy.setAuthenticated).not.toHaveBeenCalled();
    expect(adminServiceSpy.setCurrentUser).not.toHaveBeenCalled();
  });

  it('should login successfully and set authenticated user', () => {
    const user = {
      id: 1,
      userName: 'bharath',
      passWord: '123',
      firstLogin: true,
    };

    adminServiceSpy.getAdmins.mockReturnValue(of([user]));

    component.username = 'bharath';
    component.password = '123';

    component.login();

    expect(adminServiceSpy.setAuthenticated).toHaveBeenCalledWith(true);
    expect(adminServiceSpy.setCurrentUser).toHaveBeenCalledWith(user);
  });

  // ---------------------------
  // Update password
  // ---------------------------

  it('should show alert when reset credentials are invalid', () => {
    adminServiceSpy.getAdmins.mockReturnValue(of([]));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.resetUsername = 'bharath';
    component.currentPassword = '123';

    component.updatePassword();

    expect(alertSpy).toHaveBeenCalledWith('Invalid Username or Current Password');
    expect(adminServiceSpy.updateAdmin).not.toHaveBeenCalled();
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

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.resetUsername = 'bharath';
    component.currentPassword = '123';

    component.updatePassword();

    expect(alertSpy).toHaveBeenCalledWith('Password change not allowed');
    expect(adminServiceSpy.updateAdmin).not.toHaveBeenCalled();
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

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.resetUsername = 'bharath';
    component.currentPassword = '123';
    component.newPassword = '456';

    component.updatePassword();

    expect(adminServiceSpy.updateAdmin).toHaveBeenCalledWith(1, {
      ...user,
      passWord: '456',
      password: '456',
      firstLogin: false,
    });

    expect(alertSpy).toHaveBeenCalledWith('Password Updated Successfully');
    expect(component.showResetForm).toBe(false);
  });

  it('should allow update when user matches username/password alternate fields', () => {
    const user = {
      id: 2,
      username: 'admin',
      password: 'old123',
      firstLogin: true,
    };

    adminServiceSpy.getAdmins.mockReturnValue(of([user]));
    adminServiceSpy.updateAdmin.mockReturnValue(of({}));

    component.resetUsername = 'admin';
    component.currentPassword = 'old123';
    component.newPassword = 'new456';

    component.updatePassword();

    expect(adminServiceSpy.updateAdmin).toHaveBeenCalledWith(2, {
      ...user,
      passWord: 'new456',
      password: 'new456',
      firstLogin: false,
    });
  });
});