import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ServiceBeauteService } from '../../../../core/services/service-beaute.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-prendre-rdv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './prendre-rdv.component.html',
  styleUrl: './prendre-rdv.component.scss'
})
export class PrendreRdvComponent implements OnInit {
  form!: FormGroup;
  services: Service[] = [];
  loading = false;
  loadingServices = false;
  success = false;
  errorMsg = '';
  selectedService: Service | null = null;
  minDate = '';

  constructor(
    private fb: FormBuilder,
    private serviceBeaute: ServiceBeauteService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Date minimale = demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().slice(0, 16);

    this.form = this.fb.group({
      service: ['', Validators.required],
      date_heure: ['', Validators.required],
      notes: ['']
    });

    this.form.get('service')!.valueChanges.subscribe(id => {
      this.selectedService = this.services.find(s => s.id === +id) || null;
    });

    this.loadServices();
  }

  loadServices(): void {
    this.loadingServices = true;
    this.serviceBeaute.getAll().subscribe({
      next: (data) => { this.services = data.filter(s => s.actif !== false); this.loadingServices = false; },
      error: () => { this.loadingServices = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';

    const payload = {
      service: +this.form.value.service,
      date_heure: this.form.value.date_heure,
      notes: this.form.value.notes
    };

    this.appointmentService.create(payload as any).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.non_field_errors?.[0]
          || err.error?.detail
          || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }

  goToAppointments(): void {
    this.router.navigate(['/client-dashboard/appointments']);
  }
}
