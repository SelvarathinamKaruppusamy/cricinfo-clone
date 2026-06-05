import { Routes } from '@angular/router';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'completed',
    pathMatch: 'full'
  },

  {
    path: 'completed',
    loadComponent: () =>
      import('./Completed/Components/completed-list/completed-list')
        .then(c => c.CompletedListComponent)
  },

  {
    path: 'completed/:matchNo',
    loadComponent: () =>
      import('./Completed/Components/completed-details/completed-details')
        .then(c => c.CompletedDetailsComponent)
  },

  {
    path: '**',
    redirectTo: 'completed'
  }

];
