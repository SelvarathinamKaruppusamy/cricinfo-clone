import { Routes } from '@angular/router';
import { UpComp } from './up-comp/up-comp';
import { Match } from './match/match';

export const routes: Routes = [
    {
        path:'',
        component:UpComp
    },
    {
        path:'match/:id',
        component:Match
    }
];
