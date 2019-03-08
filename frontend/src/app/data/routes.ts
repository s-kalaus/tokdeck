import { Routes } from '@angular/router';
import { ErrorComponent } from '@app/component/error.component';
import { DashboardComponent } from '@app/component/dashboard/dashboard.component';
import { AuthRouteService } from '@app/service';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthRouteService] },
  { path: '**', component: ErrorComponent },
];
