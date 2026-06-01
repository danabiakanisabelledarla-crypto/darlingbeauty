import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../../core/services/produit.service';
import { Produit } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Produit[] = [];
  loading = true;
  error = '';
  success = '';
  deleteConfirmId: number | null = null;

  constructor(private produitService: ProduitService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.produitService.getAll().subscribe({
      next: d => { this.products = d; this.loading = false; },
      error: () => { this.error = 'Erreur de chargement.'; this.loading = false; }
    });
  }

  confirmDelete(id: number): void { this.deleteConfirmId = id; }
  cancelDelete(): void { this.deleteConfirmId = null; }

  delete(id: number): void {
    this.produitService.delete(id).subscribe({
      next: () => {
        this.success = 'Produit supprimé.';
        this.deleteConfirmId = null;
        this.load();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Erreur lors de la suppression.'; this.deleteConfirmId = null; }
    });
  }
}
