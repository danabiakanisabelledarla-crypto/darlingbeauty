import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Commande, StatutCommande, STATUT_COMMANDE_LABELS, STATUT_COMMANDE_COLORS } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Commande[] = [];
  loading = true;
  error = '';
  success = '';
  filterStatut = '';
  expandedId: number | null = null;
  updatingId: number | null = null;

  STATUT_LABELS = STATUT_COMMANDE_LABELS;
  STATUT_COLORS = STATUT_COMMANDE_COLORS;

  statutOptions: { value: string; label: string }[] = [
    { value: '',              label: 'Tous les statuts' },
    { value: 'en_attente',    label: 'En attente' },
    { value: 'confirmee',     label: 'Confirmée' },
    { value: 'en_preparation',label: 'En préparation' },
    { value: 'expediee',      label: 'Expédiée' },
    { value: 'livree',        label: 'Livrée' },
    { value: 'annulee',       label: 'Annulée' },
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: data => {
        this.orders = data.sort((a, b) =>
          new Date(b.date_creation!).getTime() - new Date(a.date_creation!).getTime()
        );
        this.loading = false;
      },
      error: () => { this.error = 'Erreur lors du chargement des commandes.'; this.loading = false; }
    });
  }

  get filteredOrders(): Commande[] {
    if (!this.filterStatut) return this.orders;
    return this.orders.filter(o => o.statut === this.filterStatut);
  }

  toggle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  getBadgeClass(statut: StatutCommande | undefined): string {
    const map: Record<string, string> = {
      en_attente: 'secondary', confirmee: 'primary', en_preparation: 'warning',
      expediee: 'info', livree: 'success', annulee: 'danger'
    };
    return `badge badge-${map[statut || ''] || 'secondary'}`;
  }

  updateStatut(order: Commande, statut: string): void {
    if (!order.id) return;
    this.updatingId = order.id;
    this.orderService.updateStatut(order.id, statut as StatutCommande).subscribe({
      next: () => {
        this.updatingId = null;
        this.success = 'Statut de la commande mis à jour.';
        this.load();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.updatingId = null;
        this.error = 'Erreur lors de la mise à jour du statut.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  countByStatut(key: string): number {
    if (!key) return this.orders.length;
    return this.orders.filter(o => o.statut === key).length;
  }
}