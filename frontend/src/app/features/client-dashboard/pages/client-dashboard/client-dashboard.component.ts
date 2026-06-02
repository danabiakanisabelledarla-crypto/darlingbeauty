/*import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  
})
export class ClientDashboardComponent {

}*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { OrderService } from '../../../../core/services/order.service';
import { STATUT_COMMANDE_LABELS } from '../../../../core/models/order.model';

interface Notification {
  id: string;
  type: 'rdv' | 'commande';
  message: string;
  positive: boolean;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientDashboardComponent implements OnInit {
  notifications: Notification[] = [];

  private readonly SEEN_KEY = 'db_seen_notifications';

  constructor(
    private appointmentService: AppointmentService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  private getSeenIds(): string[] {
    try {
      const raw = localStorage.getItem(this.SEEN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private markAsSeen(id: string): void {
    const seen = this.getSeenIds();
    if (!seen.includes(id)) {
      seen.push(id);
      localStorage.setItem(this.SEEN_KEY, JSON.stringify(seen));
    }
  }

  loadNotifications(): void {
    const seen = this.getSeenIds();
    const notifs: Notification[] = [];

    this.appointmentService.getAll().subscribe(rdvs => {
      rdvs.forEach(rdv => {
        if (!rdv.id) return;
        const id = `rdv-${rdv.id}-${rdv.statut}`;
        if (seen.includes(id)) return;

        if (rdv.statut === 'confirme') {
          notifs.push({
            id,
            type: 'rdv',
            positive: true,
            message: `Votre rendez-vous pour "${rdv.service_nom}" du ${this.formatDate(rdv.date_heure)} a été confirmé par l'institut.`
          });
        } else if (rdv.statut === 'annule') {
          notifs.push({
            id,
            type: 'rdv',
            positive: false,
            message: `Votre rendez-vous pour "${rdv.service_nom}" du ${this.formatDate(rdv.date_heure)} a été refusé/annulé par l'institut.`
          });
        }
      });
      this.notifications = [...notifs];
    });

    this.orderService.getMyOrders().subscribe(orders => {
      orders.forEach(order => {
        if (!order.id || order.statut === 'en_attente') return;
        const id = `commande-${order.id}-${order.statut}`;
        if (seen.includes(id)) return;

        const label = STATUT_COMMANDE_LABELS[order.statut!] || order.statut;
        notifs.push({
          id,
          type: 'commande',
          positive: order.statut !== 'annulee',
          message: order.statut === 'annulee'
            ? `Votre commande #${order.id} a été annulée.`
            : `Votre commande #${order.id} est maintenant : "${label}".`
        });
      });
      this.notifications = [...notifs];
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
           ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  dismiss(notif: Notification): void {
    this.markAsSeen(notif.id);
    this.notifications = this.notifications.filter(n => n.id !== notif.id);
  }
}
