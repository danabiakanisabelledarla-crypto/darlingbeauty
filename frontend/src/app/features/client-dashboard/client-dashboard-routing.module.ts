import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { AppointmentsClientComponent } from './pages/appointments-client/appointments-client.component';
import { ProductsClientComponent } from './pages/products-client/products-client.component';
import { OrdersClientComponent } from './pages/orders-client/orders-client.component';
import { PrendreRdvComponent } from './pages/prendre-rdv/prendre-rdv.component';
import { ServicesClientComponent } from './pages/services-client/services-client.component';

const routes: Routes = [
  { path: '',               component: ClientDashboardComponent },
  { path: 'appointments',   component: AppointmentsClientComponent },
  { path: 'products',       component: ProductsClientComponent },
  { path: 'orders',         component: OrdersClientComponent },
  { path: 'prendre-rdv',    component: PrendreRdvComponent },
  { path: 'services',       component: ServicesClientComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientDashboardRoutingModule {}