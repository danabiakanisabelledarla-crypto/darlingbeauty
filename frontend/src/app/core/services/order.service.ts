import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Commande, CartItem } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = environment.apiUrl + '/orders';

  // Panier local (géré en mémoire)
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ── Commandes API ──────────────────────────────────────────────
  // ── Commandes API ──────────────────────────────────────────────
  getMyOrders(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.API}/mes_commandes/`);
  }

  /** Toutes les commandes (admin uniquement) */
  getAll(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.API}/`);
  }

  getById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.API}/${id}/`);
  }

  create(data: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.API}/`, data);
  }

  cancel(id: number): Observable<Commande> {
    return this.http.patch<Commande>(`${this.API}/${id}/`, { statut: 'annulee' });
  }

  /** Mise à jour du statut (admin) */
  updateStatut(id: number, statut: string): Observable<Commande> {
    return this.http.patch<Commande>(`${this.API}/${id}/`, { statut });
  }

  // ── Panier local ───────────────────────────────────────────────
  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(item: CartItem): void {
    const current = [...this.cartSubject.value];
    const idx = current.findIndex(i => i.produit_id === item.produit_id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], quantite: Math.min(current[idx].quantite + item.quantite, item.stock) };
    } else {
      current.push(item);
    }
    this.cartSubject.next(current);
  }

  updateQty(produit_id: number, quantite: number): void {
    if (quantite <= 0) { this.removeFromCart(produit_id); return; }
    const current = this.cartSubject.value.map(i =>
      i.produit_id === produit_id ? { ...i, quantite } : i
    );
    this.cartSubject.next(current);
  }

  removeFromCart(produit_id: number): void {
    this.cartSubject.next(this.cartSubject.value.filter(i => i.produit_id !== produit_id));
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce((s, i) => s + i.prix * i.quantite, 0);
  }

  getCartCount(): number {
    return this.cartSubject.value.reduce((s, i) => s + i.quantite, 0);
  }
}
