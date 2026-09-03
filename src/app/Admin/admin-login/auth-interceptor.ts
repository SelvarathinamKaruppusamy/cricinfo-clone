import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AdminLoginService } from '../admin-login/admin-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const adminService = inject(AdminLoginService);
  const token = adminService.getToken();

  // APIs that don't need token
  const publicApis = [
    '/api/auth/login',
    '/api/auth/reset-password',
    '/api/auth/logout',
  ];

  const isPublic = publicApis.some((url) => req.url.includes(url));

    // Cloudinary not need Header -Authorization (Bearer Token)
  const isCloudinary = req.url.includes('api.cloudinary.com');

  const authReq =
    !isPublic && !isCloudinary && token   //blocked for cloudinary... 
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !isPublic) {
        adminService.clearLocalSession();
      }
      return throwError(() => err);
    })
  );
};