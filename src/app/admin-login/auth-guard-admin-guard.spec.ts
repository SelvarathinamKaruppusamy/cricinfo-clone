import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { authGuardAdminGuard } from './auth-guard-admin-guard';
import { AdminService } from './admin-service';

describe('authGuardAdminGuard', () => {
  let adminServiceSpy: any;
  let routerSpy: any;

  beforeEach(() => {
    adminServiceSpy = {
      isAuthenticated: vi.fn(),
    };

    routerSpy = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdminService,
          useValue: adminServiceSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });
  });

  it('should allow access when user is authenticated', () => {
    adminServiceSpy.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuardAdminGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', () => {
    adminServiceSpy.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuardAdminGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });
});