import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LogsComponent} from "./logs/logs.component";
import {UsersComponent} from "./users/users.component";
import {LayoutComponent} from "./layout/layout.component";
import { PrescriptionComponent } from './prescription/prescription.component';
import { CampReportListComponent } from '../camp-report-list/camp-report-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        component: LogsComponent,
        path: 'logs'
      },
      {
        component: UsersComponent,
        path: 'users'
      },
      {
        component: PrescriptionComponent,
        path: 'prescription'
      },
      {
        component: CampReportListComponent,
        path: 'camp-report-list'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
