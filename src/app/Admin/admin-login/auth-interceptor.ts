import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  // APIs that don't need token
  const publicApis = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password'
  ];

  const isPublic = publicApis.some(url =>
    req.url.includes(url)
  );

  if (isPublic) {
    return next(req);
  }

  // Add token
  if (token) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};