import { Routes } from '@angular/router';
import { Livepage } from '../LivePages/livepage/livepage';
import { LiveMatchCard } from '../LivePages/live-match-card/live-match-card';

export const routes: Routes = [
    {
        path:"",
        component:LiveMatchCard
    },
    {
        path:"livepage",
        component:Livepage
    }
];
