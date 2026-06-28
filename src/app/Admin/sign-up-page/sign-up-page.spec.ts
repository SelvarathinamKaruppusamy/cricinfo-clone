import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { Signup } from './sign-up-page';
import { AdminService } from '../admin-login/admin-service';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let adminServiceSpy: any;

  beforeEach(async () => {
    adminServiceSpy = {
      getAdmins: vi.fn().mockReturnValue(of([])),
      createAdmin: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        {
          provide: AdminService,
          useValue: adminServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have username control', () => {
    expect(component.adminForm.contains('username')).toBe(true);
  });

  it('should have password control', () => {
    expect(component.adminForm.contains('password')).toBe(true);
  });

  it('should generate password of length 10', () => {
    component.generatePassword();

    const password = component.adminForm.get('password')?.value;

    expect(password).toBeTruthy();
    expect(password?.length).toBe(10);
  });

  it('should make username required', () => {
    const username = component.adminForm.get('username');

    username?.setValue('');

    expect(username?.valid).toBe(false);
  });

  it('should not call service when form is invalid', () => {
    component.adminForm.patchValue({
      username: '',
    });

    component.register();

    expect(adminServiceSpy.getAdmins).not.toHaveBeenCalled();
    expect(adminServiceSpy.createAdmin).not.toHaveBeenCalled();
  });

  it('should call getAdmins and createAdmin when form is valid', () => {
    component.adminForm.patchValue({
      username: 'bharath',
      password: 'Test123456',
    });

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.register();

    expect(adminServiceSpy.getAdmins).toHaveBeenCalledTimes(1);
    expect(adminServiceSpy.createAdmin).toHaveBeenCalledTimes(1);
  });

  it('should show success alert after registration', () => {
    component.adminForm.patchValue({
      username: 'bharath',
      password: 'Test123456',
    });

    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.register();

    expect(alertSpy).toHaveBeenCalledWith(
      'Admin Registered Successfully'
    );
  });

  it('should reset form after successful registration', () => {
    component.adminForm.patchValue({
      username: 'bharath',
      password: 'Test123456',
    });

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.register();

    expect(component.adminForm.get('username')?.value).toBe(null);
  });

  it('should generate a new password after reset', () => {
    component.adminForm.patchValue({
      username: 'bharath',
      password: 'Test123456',
    });

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.register();

    const password = component.adminForm.get('password')?.value;

    expect(password).toBeTruthy();
    expect(password?.length).toBe(10);
  });
});