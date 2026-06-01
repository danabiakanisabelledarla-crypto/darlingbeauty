import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceBeauteService } from '../../../core/services/service-beaute.service';
import { Categorie } from '../../../core/models/service.model';

@Component({ selector: 'app-service-form', templateUrl: './service-form.component.html', styleUrls: ['./service-form.component.scss'] })
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  loadingData = false;
  error = '';
  isEdit = false;
  serviceId: number | null = null;
  categories: Categorie[] = [];

  constructor(private fb: FormBuilder, private svc: ServiceBeauteService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      categorie: [null],
      duree_minutes: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
      prix: [0, [Validators.required, Validators.min(1)]],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.svc.getCategories().subscribe(c => this.categories = c);
    this.serviceId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.serviceId) { this.isEdit = true; this.loadService(); }
  }

  loadService(): void {
    this.loadingData = true;
    this.svc.getById(this.serviceId!).subscribe({
      next: s => { this.form.patchValue(s); this.loadingData = false; },
      error: () => { this.error = 'Service introuvable.'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const obs = this.isEdit ? this.svc.update(this.serviceId!, this.form.value) : this.svc.create(this.form.value);
    obs.subscribe({
      next: () => this.router.navigate(['/services']),
      error: err => {
        this.loading = false;
        if (err.error) { const msgs = Object.values(err.error).flat(); this.error = (msgs[0] as string) || 'Erreur.'; }
        else this.error = 'Erreur lors de la sauvegarde.';
      }
    });
  }

  get f() { return this.form.controls; }
}
