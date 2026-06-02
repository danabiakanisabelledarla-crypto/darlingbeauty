import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../../../core/services/produit.service';
import { OrderService } from '../../../../core/services/order.service';
import { Produit } from '../../../../core/models/product.model';
import { CartItem } from '../../../../core/models/order.model';

@Component({
  selector: 'app-products-client',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products-client.component.html',
  styleUrl: './products-client.component.scss'
})
export class ProductsClientComponent implements OnInit {
  products: Produit[] = [];
  filtered: Produit[] = [];
  loading = false;
  search = '';
  cart: CartItem[] = [];
  cartOpen = false;
  cartTotal = 0;
  orderSuccess = false;
  orderLoading = false;
  orderError = '';
  adresseLivraison = '';
  showCartStep = false; // false = catalogue, true = panier

  constructor(
    private produitService: ProduitService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.load();
    this.orderService.cart$.subscribe(c => {
      this.cart = c;
      this.cartTotal = this.orderService.getCartTotal();
    });
  }

  load(): void {
    this.loading = true;
    this.produitService.getAll().subscribe({
      next: (data) => {
        this.products = data.filter(p => p.actif !== false && p.stock > 0);
        this.filtered = [...this.products];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterProducts(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.products.filter(p =>
      p.nom.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.marque || '').toLowerCase().includes(q)
    );
  }

  getQtyInCart(id: number): number {
    return this.cart.find(i => i.produit_id === id)?.quantite || 0;
  }

  addOne(p: Produit): void {
    if (!p.id) return;
    const qty = this.getQtyInCart(p.id);
    if (qty >= p.stock) return;
    this.orderService.addToCart({
      produit_id: p.id!,
      nom: p.nom,
      prix: p.prix_vente,
      quantite: 1,
      stock: p.stock
    });
  }

  removeOne(p: Produit): void {
    if (!p.id) return;
    const qty = this.getQtyInCart(p.id);
    this.orderService.updateQty(p.id, qty - 1);
  }

  removeFromCart(id: number): void {
    this.orderService.removeFromCart(id);
  }

  get cartCount(): number {
    return this.orderService.getCartCount();
  }

  placeOrder(): void {
    if (this.cart.length === 0) return;
    this.orderLoading = true;
    this.orderError = '';
    const commande = {
      lignes: this.cart.map(i => ({ produit_id: i.produit_id, quantite: i.quantite })),
      adresse_livraison: this.adresseLivraison,
    };
    this.orderService.create(commande as any).subscribe({
      next: () => {
        this.orderLoading = false;
        this.orderSuccess = true;
        this.orderService.clearCart();
        this.showCartStep = false;
      },
      error: (err) => {
        this.orderLoading = false;
        this.orderError = err.error?.detail || 'Erreur lors de la commande. Veuillez réessayer.';
      }
    });
  }
}
