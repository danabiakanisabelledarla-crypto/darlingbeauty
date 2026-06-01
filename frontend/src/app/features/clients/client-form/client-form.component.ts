import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  loadingData = false;
  error = '';
  isEdit = false;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', Validators.email],
      genre: ['F', Validators.required],
      date_naissance: [''],
      adresse: [''],
      notes: [''],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.clientId) {
      this.isEdit = true;
      this.loadClient();
    }
  }

  loadClient(): void {
    this.loadingData = true;
    this.clientService.getById(this.clientId!).subscribe({
      next: client => { this.form.patchValue(client); this.loadingData = false; },
      error: () => { this.error = 'Client introuvable.'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';

    const obs = this.isEdit
      ? this.clientService.update(this.clientId!, this.form.value)
      : this.clientService.create(this.form.value);

    obs.subscribe({
      next: () => this.router.navigate(['/clients']),
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
