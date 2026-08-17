import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCloudinaryLoader } from '@angular/common';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { routes } from './app.routes';
import { authInterceptor } from './Admin/admin-login/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
    ),

    provideHttpClient(withInterceptors([authInterceptor])),

    provideCloudinaryLoader('https://res.cloudinary.com/dde7fld9d'),

    provideLottieOptions({
      player: () => player,
    }),
  ],
};
