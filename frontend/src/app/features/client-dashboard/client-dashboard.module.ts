import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientDashboardRoutingModule } from './client-dashboard-routing.module';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    ClientDashboardRoutingModule,
    ClientDashboardComponent
  ]
})
export class ClientDashboardModule { }
