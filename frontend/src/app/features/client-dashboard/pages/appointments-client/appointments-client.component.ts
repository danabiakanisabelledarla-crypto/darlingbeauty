import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { RendezVous, STATUT_LABELS, STATUT_COLORS, StatutRDV } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointments-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointments-client.component.html',
  styleUrl: './appointments-client.component.scss'
})
export class AppointmentsClientComponent implements OnInit {
  allRdv: RendezVous[] = [];
  filteredRdv: RendezVous[] = [];
  loading = false;
  errorMsg = '';
  activeFilter: string = 'all';
  cancellingId: number | null = null;
  cancelSuccess = false;

  filters = [
    { key: 'all',      label: 'Tous' },
    { key: 'planifie', label: 'Planifiés' },
    { key: 'confirme', label: 'Confirmés' },
    { key: 'en_cours', label: 'En cours' },
    { key: 'termine',  label: 'Terminés' },
    { key: 'annule',   label: 'Annulés' },
  ];

  statutLabels = STATUT_LABELS;
  statutColors = STATUT_COLORS;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.allRdv = data.sort((a, b) =>
          new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime()
        );
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.errorMsg = 'Impossible de charger vos rendez-vous.'; this.loading = false; }
    });
  }

  setFilter(key: string): void {
    this.activeFilter = key;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredRdv = this.activeFilter === 'all'
      ? this.allRdv
      : this.allRdv.filter(r => r.statut === this.activeFilter);
  }

  canCancel(rdv: RendezVous): boolean {
    return rdv.statut === 'planifie' || rdv.statut === 'confirme';
  }

  cancelRdv(rdv: RendezVous): void {
    if (!rdv.id) return;
    this.cancellingId = rdv.id;
    this.appointmentService.update(rdv.id, { statut: 'annule' }).subscribe({
      next: () => {
        this.cancellingId = null;
        this.cancelSuccess = true;
        this.load();
        setTimeout(() => this.cancelSuccess = false, 3000);
      },
      error: () => { this.cancellingId = null; }
    });
  }

  isFuture(date: string): boolean {
    return new Date(date) > new Date();
  }

  getStatutClass(statut: StatutRDV | undefined): string {
    const map: Record<string, string> = {
      planifie: 'badge-planifie', confirme: 'badge-confirme',
      en_cours: 'badge-en-cours', termine: 'badge-termine',
      annule: 'badge-annule', absent: 'badge-absent'
    };
    return map[statut || ''] || '';
  }

  countByStatut(key: string): number {
    if (key === 'all') return this.allRdv.length;
    return this.allRdv.filter(r => r.statut === key).length;
  }
}
