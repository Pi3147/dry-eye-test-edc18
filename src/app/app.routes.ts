import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        loadChildren : () => import('./admin/admin.module').then(value => value.AdminModule),
        canActivate : [adminGuard]
    },
];
