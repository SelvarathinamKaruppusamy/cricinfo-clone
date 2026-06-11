import { Routes } from '@angular/router';
import { Squads } from './squads/squads';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full',
  },
  {
    path: 'squads',
    component: Squads,
  },
];
