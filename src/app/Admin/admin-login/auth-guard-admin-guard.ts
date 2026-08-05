import { CanActivateFn, Router } from '@angular/router';
import { AdminLoginService } from './admin-service';
import { inject } from '@angular/core';

export const authGuardAdminGuard: CanActivateFn = (route, state) => {
 
 const authService = inject(AdminLoginService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin']);
  return false;
}
