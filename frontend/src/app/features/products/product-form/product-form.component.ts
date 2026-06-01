import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  loadingData = false;
  error = '';
  isEdit = false;
  produitId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      marque: [''],
      description: [''],
      prix_achat: [0, [Validators.required, Validators.min(0)]],
      prix_vente: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      stock_minimum: [5, [Validators.required, Validators.min(0)]],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.produitId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.produitId) { this.isEdit = true; this.loadProduit(); }
  }

  loadProduit(): void {
    this.loadingData = true;
    this.produitService.getById(this.produitId!).subscribe({
      next: p => { this.form.patchValue(p); this.loadingData = false; },
      error: () => { this.error = 'Produit introuvable.'; this.loadingData = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    // Validate prix_vente >= prix_achat
    if (this.form.value.prix_vente < this.form.value.prix_achat) {
      this.error = 'Le prix de vente ne peut pas être inférieur au prix d\'achat.';
      return;
    }

    this.loading = true;
    this.error = '';
    const obs = this.isEdit
      ? this.produitService.update(this.produitId!, this.form.value)
      : this.produitService.create(this.form.value);

    obs.subscribe({
      next: () => this.router.navigate(['/products']),
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
