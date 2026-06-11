import { Routes } from '@angular/router';
import { Squads } from './squads/squads';
import { UpComp } from './up-comp/up-comp';
import { Match } from './match/match';
import { LiveMatchCard } from './LivePages/live-match-card/live-match-card';
import { Livepage } from './LivePages/livepage/livepage';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full',
  },
  {
    path:'live',
    component:LiveMatchCard
  },
  {
    path:'livepage',
    component:Livepage

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
