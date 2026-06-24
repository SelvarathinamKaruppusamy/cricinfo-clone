import { Routes } from '@angular/router';
import { UpComp } from './UpCommingPage/up-comp/up-comp';
import { Match } from './UpCommingPage/match/match';
import { LiveMatchCard } from './LivePages/live-match-card/live-match-card';
import { Livepage } from './LivePages/livepage/livepage';
import { BlogList } from './Completed/Components/blog-list/blog-list';
import { BlogDetails } from './Completed/Components/blog-details/blog-details';
import { PointsTable } from './points-table/points-table';
import { Stats } from './stats/stats';
import { Schedule } from './schedule/schedule';
import { Upcome } from './Admin/upcome/upcome';
import { NavBar } from './Admin/nav-bar/nav-bar';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full',
  },
  {
    path: 'live',
    component: LiveMatchCard,
    children:[
       {
    path: 'livepage',
    component: Livepage,
  },
  {
    path: 'match/:id',
    component: Match,
  },
   {
  path: 'completed/:matchNo',
  loadComponent: () =>
    import('./Completed/Components/completed-details/completed-details').then(c=>c.CompletedDetails),
  },
   {
    path:'schedule/:id',
    component:Schedule
  },
  {
    path: 'points-table/:matchNo',
    component: PointsTable,
  },
]
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
    children:[
      {
        path:'upcomingMatchPage',
        component:Match,
      }
    ]
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
  {
    path:'schedule/:id',
    component:Schedule
  },
  {
  path: 'navbarAdmin',
  component: NavBar,
  children: [
    {
     path:'upComeAdmin',
    component: Upcome
    }
  ]
},
  {
    path:'upComeAdmin',
    component: Upcome
  }
  
];
