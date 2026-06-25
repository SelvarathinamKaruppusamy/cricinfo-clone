import { Routes } from '@angular/router';
import { UpComp } from './UpCommingPage/up-comp/up-comp';
import { Match } from './UpCommingPage/match/match';
import { LiveMatchCard } from './LivePages/live-match-card/live-match-card';
import { Livepage } from './LivePages/livepage/livepage';
import { BlogList } from './Blog/blog-list/blog-list';
import { BlogDetails } from './Blog/blog-details/blog-details';
import { PointsTable } from './points-table/points-table';
import { Stats } from './stats/stats';
import { Schedule } from './schedule/schedule';
import { BlogManagementComponent } from './BlogManagement/blog-management/blog-management';
import { BlogForm } from './BlogManagement/edit-blog/blog-form';
import { AddBlog } from './BlogManagement/add-blog/add-blog';

import { LiveAdmin } from './Admin/LiveAdmin/live-admin/live-admin';
import { TossPanel } from './Admin/LiveAdmin/toss-panel/toss-panel';
import { LiveUpdateAdmin } from './Admin/LiveAdmin/live-update-admin/live-update-admin';
import { CompletedUpdateAdmin } from './Admin/LiveAdmin/completed-update-admin/completed-update-admin';
import { NavBar } from './Admin/nav-bar/nav-bar';
import { Upcome } from './Admin/upcome/upcome';
import { authGuardAdminGuard } from './admin-login/auth-guard-admin-guard';
import { AdminLogin } from './admin-login/admin-login';
import { Profile } from './profile/profile';
import { Signup } from './Admin/sign-up-page/sign-up-page';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full',
  },
  {
    path: 'live',
    component: LiveMatchCard,
    children: [
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
          import('./Completed/Components/completed-details/completed-details').then(
            (c) => c.CompletedDetails,
          ),
      },
      {
        path: 'schedule/:id',
        component: Schedule,
      },
      {
        path: 'points-table/:matchNo',
        component: PointsTable,
      },
    ],
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
    children: [
      {
        path: 'upcomingMatchPage',
        component: Match,
      },
    ],
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
    path: 'schedule/:id',
    component: Schedule,
  },
  {
    path: 'admin',
    component: AdminLogin,
  },
  {
    path: 'navbarAdmin',
    component: NavBar,
    canActivate: [authGuardAdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'adminLive',
        pathMatch: 'full',
      },

      {
        path: 'upComeAdmin',
        component: Upcome,
      },
      {
        path: 'signup',
        component: Signup,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'adminLive',
        component: LiveAdmin,
        children: [
          { path: '', redirectTo: 'toss', pathMatch: 'full' },
          { path: 'toss', component: TossPanel },
          {
            path: 'liveupdate',
            component: LiveUpdateAdmin,
          },
          {
            path: 'completed',
            component: CompletedUpdateAdmin,
          },
        ],
      },
      {
        path: 'blogs',
        component: BlogManagementComponent,
      },
      {
        path: 'blogs/add',
        component: AddBlog,
      },
      {
        path: 'blogs/edit/:id',
        component: BlogForm,
      },
    ],
  },
];
