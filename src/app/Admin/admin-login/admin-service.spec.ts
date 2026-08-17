import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AdminService } from './admin-service';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get admins', () => {
    const mockAdmins = [
      {
        adminId: 1,
        username: 'bharath',
        password: '123',
      },
    ];

    service.getAdmins().subscribe((admins) => {
      expect(admins).toEqual(mockAdmins);
    });

    const req = httpMock.expectOne(
      'http://localhost:9999/admin'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockAdmins);
  });

  it('should create admin', () => {
    const newAdmin = {
      adminId: 1,
      username: 'bharath',
      password: '123',
    };

    service.createAdmin(newAdmin).subscribe((response) => {
      expect(response).toEqual(newAdmin);
    });

    const req = httpMock.expectOne(
      'http://localhost:9999/admin'
    );

    expect(req.request.method).toBe('POST');

    req.flush(newAdmin);
  });

  it('should update admin', () => {
    const updatedAdmin = {
      adminId: 1,
      username: 'bharath',
      password: '456',
    };

    service.updateAdmin('1', updatedAdmin).subscribe((response) => {
      expect(response).toEqual(updatedAdmin);
    });

    const req = httpMock.expectOne(
      'http://localhost:9999/admin/1'
    );

    expect(req.request.method).toBe('PUT');

    req.flush(updatedAdmin);
  });

  it('should authenticate user', () => {
    service.setAuthenticated(true);

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout user', () => {
    service.setAuthenticated(true);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
  });
});