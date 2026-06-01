import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';

const routes: Routes = [
  { path: '', component: ServiceListComponent },
  { path: 'new', component: ServiceFormComponent },
  { path: ':id/edit', component: ServiceFormComponent }
];

@NgModule({
  declarations: [ServiceListComponent, ServiceFormComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class ServicesModule {}
