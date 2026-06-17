import { Routes } from '@angular/router';
import { Squads } from './NavBar/squads/squads';
import { UpComp } from './UpCommingPage/up-comp/up-comp';
import { Match } from './UpCommingPage/match/match';
import { LiveMatchCard } from './LivePages/live-match-card/live-match-card';
import { Livepage } from './LivePages/livepage/livepage';
import { BlogList } from './Completed/Components/blog-list/blog-list';
import { BlogDetails } from './Completed/Components/blog-details/blog-details';
import { PointsTable } from './points-table/points-table';
import { Stats } from './stats/stats';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full',
  },
  {
    path: 'live',
    component: LiveMatchCard,
  },
  {
    path: 'livepage',
    component: Livepage,
  },
  {
    path: 'squads',
    component: Squads,
  },
  {
    path: 'stats/:type',
    component: Stats,
  },
  {
    path: 'match/:id',
    component: Match,
  },
  {
    path: 'upcoming',
    component: UpComp,
  },
  {
    path: 'completed',
    loadComponent: () =>
      import('./Completed/Components/completed-list/completed-list').then((c) => c.CompletedList),
  },
  {
    path: 'completed/:matchNo',
    loadComponent: () =>
      import('./Completed/Components/completed-details/completed-details').then(
        (c) => c.CompletedDetails,
      ),
  },
  {
    path: 'blog',
    component: BlogList,
  },
  {
    path: 'blog-detail/:id',
    component: BlogDetails,
  },
  {
    path: 'points-table',
    component: PointsTable,
  },
  {
    path: 'points-table/:matchNo',
    component: PointsTable,
  },
];
