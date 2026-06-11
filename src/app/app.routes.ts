import { Routes } from '@angular/router';
// Import them directly at the top
import { BlogList } from './Completed/Components/blog-list/blog-list';
import { BlogDetails } from './Completed/Components/blog-details/blog-details';

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
  // FIX: Change lazy loading to direct component assignment for your blog blocks
  {
    path: 'blog',
    component: BlogList
  },
  {
    path: 'blog-detail/:id',
    component: BlogDetails
  },
  {
    path: '**',
    redirectTo: 'completed'
  }
];