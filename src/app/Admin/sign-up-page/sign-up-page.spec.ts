import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Signup } from './sign-up-page';
import { AdminService } from '../admin-login/admin-service';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  const mockAdminService = {
    getAdmins: vi.fn(),
    createAdmin: vi.fn(),
  };

  beforeEach(async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    })
      .overrideComponent(Signup, {
        set: {
          template: '<div>Signup</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a password of length 10', () => {
    component.generatePassword();

    expect(component.adminForm.value.password?.length).toBe(10);
  });

  it('should initialize password in constructor', () => {
    expect(component.adminForm.value.password).toBeTruthy();
    expect(component.adminForm.value.password?.length).toBe(10);
  });

  it('should have invalid form initially', () => {
    component.adminForm.patchValue({
      password: '',
    });

    expect(component.adminForm.invalid).toBe(true);
  });

  it('should mark form as touched when invalid', () => {
    const spy = vi.spyOn(component.adminForm, 'markAllAsTouched');

    component.register();

    expect(spy).toHaveBeenCalled();
  });

  it('should register admin successfully', () => {
    component.adminForm.setValue({
      username: 'admin',
      password: 'Password1',
      fname: 'John',
      lname: 'Doe',
      email: 'john@test.com',
      gender: 'Male',
      mobileNo: '9876543210',
      role: 'Admin',
      address: '123 Main Street Chennai',
      dob: '2000-01-01',
    });

    mockAdminService.getAdmins.mockReturnValue(
      of([
        {
          id: '1',
        },
      ]),
    );

    mockAdminService.createAdmin.mockReturnValue(of({}));

    component.register();

    expect(mockAdminService.getAdmins).toHaveBeenCalled();

    expect(mockAdminService.createAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '2',
        userName: 'admin',
        passWord: 'Password1',
        firstLogin: true,
      }),
    );

    expect(window.alert).toHaveBeenCalledWith('Admin Registered Successfully');
  });

  it('should create first admin with id 1', () => {
    component.adminForm.setValue({
      username: 'admin',
      password: 'Password1',
      fname: 'John',
      lname: 'Doe',
      email: 'john@test.com',
      gender: 'Male',
      mobileNo: '9876543210',
      role: 'Admin',
      address: '123 Main Street Chennai',
      dob: '2000-01-01',
    });

    mockAdminService.getAdmins.mockReturnValue(of([]));

    mockAdminService.createAdmin.mockReturnValue(of({}));

    component.register();

    expect(mockAdminService.createAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
      }),
    );
  });

  it('should regenerate password after successful registration', () => {
    const spy = vi.spyOn(component, 'generatePassword');

    component.adminForm.setValue({
      username: 'admin',
      password: 'Password1',
      fname: 'John',
      lname: 'Doe',
      email: 'john@test.com',
      gender: 'Male',
      mobileNo: '9876543210',
      role: 'Admin',
      address: '123 Main Street Chennai',
      dob: '2000-01-01',
    });

    mockAdminService.getAdmins.mockReturnValue(of([]));

    mockAdminService.createAdmin.mockReturnValue(of({}));

    component.register();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle getAdmins error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    component.adminForm.setValue({
      username: 'admin',
      password: 'Password1',
      fname: 'John',
      lname: 'Doe',
      email: 'john@test.com',
      gender: 'Male',
      mobileNo: '9876543210',
      role: 'Admin',
      address: '123 Main Street Chennai',
      dob: '2000-01-01',
    });

    mockAdminService.getAdmins.mockReturnValue(throwError(() => new Error('API Error')));

    component.register();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle createAdmin error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    component.adminForm.setValue({
      username: 'admin',
      password: 'Password1',
      fname: 'John',
      lname: 'Doe',
      email: 'john@test.com',
      gender: 'Male',
      mobileNo: '9876543210',
      role: 'Admin',
      address: '123 Main Street Chennai',
      dob: '2000-01-01',
    });

    mockAdminService.getAdmins.mockReturnValue(of([]));

    mockAdminService.createAdmin.mockReturnValue(throwError(() => new Error('Create Error')));

    component.register();

    expect(spy).toHaveBeenCalled();
  });
});
