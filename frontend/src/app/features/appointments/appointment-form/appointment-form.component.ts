import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ClientService } from '../../../core/services/client.service';
import { ServiceBeauteService } from '../../../core/services/service-beaute.service';
import { Client } from '../../../core/models/client.model';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  loadingData = true;
  error = '';
  isEdit = false;
  rdvId: number | null = null;
  clients: Client[] = [];
  services: Service[] = [];

  statutOptions = [
    { value: 'planifie', label: 'Planifié' },
    { value: 'confirme', label: 'Confirmé' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'termine', label: 'Terminé' },
    { value: 'annule', label: 'Annulé' },
    { value: 'absent', label: 'Client absent' }
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private serviceBeauteService: ServiceBeauteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      client: [null, Validators.required],
      service: [null, Validators.required],
      date_heure: ['', Validators.required],
      statut: ['planifie'],
      notes: [''],
      prix_applique: [null]
    });
  }

  ngOnInit(): void {
    this.rdvId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.rdvId) this.isEdit = true;

    Promise.all([
      this.clientService.getAll().toPromise(),
      this.serviceBeauteService.getAll().toPromise()
    ]).then(([clients, services]) => {
      this.clients = clients || [];
      this.services = services || [];
      if (this.isEdit) this.loadRdv();
      else this.loadingData = false;
    });

    // Auto-fill prix when service changes
    this.form.get('service')!.valueChanges.subscribe(serviceId => {
      const svc = this.services.find(s => s.id == serviceId);
      if (svc && !this.isEdit) {
        this.form.patchValue({ prix_applique: svc.prix });
      }
    });
  }

  loadRdv(): void {
    this.appointmentService.getById(this.rdvId!).subscribe({
      next: rdv => {
        const dateLocal = new Date(rdv.date_heure);
        const formatted = this.toDatetimeLocal(dateLocal);
        this.form.patchValue({ ...rdv, date_heure: formatted });
        this.loadingData = false;
      },
      error: () => { this.error = 'Rendez-vous introuvable.'; this.loadingData = false; }
    });
  }

  toDatetimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';

    const payload = {
      ...this.form.value,
      client: Number(this.form.value.client),
      service: Number(this.form.value.service)
    };

    const obs = this.isEdit
      ? this.appointmentService.update(this.rdvId!, payload)
      : this.appointmentService.create(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: err => {
        this.loading = false;
        if (err.error) {
          const msgs = Object.values(err.error).flat();
          this.error = (msgs[0] as string) || 'Erreur lors de la sauvegarde.';
        } else {
          this.error = 'Erreur lors de la sauvegarde.';
        }
      }
    });
  }

  get f() { return this.form.controls; }
}
