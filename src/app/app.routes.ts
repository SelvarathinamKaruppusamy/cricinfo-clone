import { Routes } from '@angular/router';
import { Squads } from './squads/squads';
import { UpComp } from './up-comp/up-comp';
import { Match } from './match/match';

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
  {
    path: 'match/:id',
    component: Match,
  },
  {
    path:'upcoming',
    component:UpComp
  }
];
