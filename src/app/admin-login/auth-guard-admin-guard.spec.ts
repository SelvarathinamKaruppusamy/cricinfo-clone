import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuardAdminGuard } from './auth-guard-admin-guard';

describe('authGuardAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuardAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
