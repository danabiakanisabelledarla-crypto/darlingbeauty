import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { RendezVous, STATUT_LABELS, STATUT_COLORS, StatutRDV } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  appointments: RendezVous[] = [];
  loading = true;
  error = '';
  success = '';
  filterStatut = '';
  filterDate = '';
  deleteConfirmId: number | null = null;

  STATUT_LABELS = STATUT_LABELS;
  STATUT_COLORS = STATUT_COLORS;

  statutOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'planifie', label: 'Planifié' },
    { value: 'confirme', label: 'Confirmé' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'termine', label: 'Terminé' },
    { value: 'annule', label: 'Annulé' },
    { value: 'absent', label: 'Client absent' }
  ];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.appointmentService.getAll(this.filterStatut, this.filterDate).subscribe({
      next: data => { this.appointments = data; this.loading = false; },
      error: () => { this.error = 'Erreur lors du chargement des rendez-vous.'; this.loading = false; }
    });
  }

  onFilter(): void { this.load(); }

  getBadgeClass(statut: StatutRDV): string {
    return `badge badge-${STATUT_COLORS[statut] || 'secondary'}`;
  }

  updateStatut(id: number, statut: string): void {
    this.appointmentService.update(id, { statut: statut as StatutRDV }).subscribe({
      next: () => { this.success = 'Statut mis à jour.'; this.load(); setTimeout(() => this.success = '', 3000); },
      error: () => { this.error = 'Erreur lors de la mise à jour.'; }
    });
  }

  confirmDelete(id: number): void { this.deleteConfirmId = id; }
  cancelDelete(): void { this.deleteConfirmId = null; }

  delete(id: number): void {
    this.appointmentService.delete(id).subscribe({
      next: () => {
        this.success = 'Rendez-vous supprimé.';
        this.deleteConfirmId = null;
        this.load();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Erreur lors de la suppression.'; this.deleteConfirmId = null; }
    });
  }
}
