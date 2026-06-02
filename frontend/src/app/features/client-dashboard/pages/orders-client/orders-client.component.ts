import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Commande, STATUT_COMMANDE_LABELS, STATUT_COMMANDE_COLORS, StatutCommande } from '../../../../core/models/order.model';

@Component({
  selector: 'app-orders-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-client.component.html',
  styleUrl: './orders-client.component.scss'
})
export class OrdersClientComponent implements OnInit {
  orders: Commande[] = [];
  loading = false;
  errorMsg = '';
  expandedId: number | null = null;
  cancellingId: number | null = null;
  cancelSuccess = false;

  statutLabels = STATUT_COMMANDE_LABELS;
  statutColors = STATUT_COMMANDE_COLORS;

  readonly STEPS: StatutCommande[] = ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) =>
          new Date(b.date_creation!).getTime() - new Date(a.date_creation!).getTime()
        );
        this.loading = false;
      },
      error: () => { this.errorMsg = 'Impossible de charger vos commandes.'; this.loading = false; }
    });
  }

  toggle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  canCancel(order: Commande): boolean {
    return order.statut === 'en_attente';
  }

  cancelOrder(order: Commande): void {
    if (!order.id) return;
    this.cancellingId = order.id;
    this.orderService.cancel(order.id).subscribe({
      next: () => {
        this.cancellingId = null;
        this.cancelSuccess = true;
        this.load();
        setTimeout(() => this.cancelSuccess = false, 3000);
      },
      error: () => { this.cancellingId = null; }
    });
  }

  getStepIndex(statut: StatutCommande | undefined): number {
    if (!statut || statut === 'annulee') return -1;
    return this.STEPS.indexOf(statut);
  }

  getStatutStyle(statut: StatutCommande | undefined): object {
    const color = this.statutColors[statut!] || '#888';
    return { 'background-color': color + '22', 'color': color, 'border-color': color + '55' };
  }
}
