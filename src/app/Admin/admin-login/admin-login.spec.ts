import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AdminLogin } from './admin-login';
import { AdminService } from './admin-service';

describe('AdminLogin', () => {
  let component: AdminLogin;
  let fixture: ComponentFixture<AdminLogin>;

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockAdminService = {
    getAdmins: vi.fn(),
    setAuthenticated: vi.fn(),
    setCurrentUser: vi.fn(),
    updateAdmin: vi.fn(),
  };

  beforeEach(async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [AdminLogin],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    })
      .overrideComponent(AdminLogin, {
        set: {
          template: '<div>Admin Login</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminLogin);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    component.username = 'admin';
    component.password = '1234';

    const user = {
      id: '1',
      userName: 'admin',
      passWord: '1234',
      firstLogin: true,
    };

    mockAdminService.getAdmins.mockReturnValue(of([user]));

    component.login();

    expect(mockAdminService.setAuthenticated).toHaveBeenCalledWith(true);
    expect(mockAdminService.setCurrentUser).toHaveBeenCalledWith(user);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/navbarAdmin']);
  });

  it('should show alert for invalid login', () => {
    component.username = 'wrong';
    component.password = 'wrong';

    mockAdminService.getAdmins.mockReturnValue(of([]));

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Invalid Username or Password');
  });

  it('should open reset form', () => {
    component.openResetForm();

    expect(component.showResetForm).toBe(true);
  });

  it('should cancel reset form', () => {
    component.showResetForm = true;
    component.resetUsername = 'admin';
    component.currentPassword = '123';
    component.newPassword = '456';

    component.cancelReset();

    expect(component.showResetForm).toBe(false);
    expect(component.resetUsername).toBe('');
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
  });

  it('should update password successfully', () => {
    component.resetUsername = 'admin';
    component.currentPassword = '1234';
    component.newPassword = '5678';

    const user = {
      id: '1',
      userName: 'admin',
      passWord: '1234',
      firstLogin: true,
    };

    mockAdminService.getAdmins.mockReturnValue(of([user]));
    mockAdminService.updateAdmin.mockReturnValue(of({}));

    component.updatePassword();

    expect(mockAdminService.updateAdmin).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        passWord: '5678',
        password: '5678',
        firstLogin: false,
      }),
    );

    expect(window.alert).toHaveBeenCalledWith('Password Updated Successfully');
  });

  it('should show alert for invalid username or current password', () => {
    component.resetUsername = 'admin';
    component.currentPassword = 'wrong';

    mockAdminService.getAdmins.mockReturnValue(of([]));

    component.updatePassword();

    expect(window.alert).toHaveBeenCalledWith('Invalid Username or Current Password');
  });

  it('should not allow password change when first login is false', () => {
    component.resetUsername = 'admin';
    component.currentPassword = '1234';

    const user = {
      id: '1',
      userName: 'admin',
      passWord: '1234',
      firstLogin: false,
    };

    mockAdminService.getAdmins.mockReturnValue(of([user]));

    component.updatePassword();

    expect(window.alert).toHaveBeenCalledWith('Password change not allowed');
  });
});
