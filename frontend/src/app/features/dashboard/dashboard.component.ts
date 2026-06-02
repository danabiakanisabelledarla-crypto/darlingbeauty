import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { ClientService } from '../../core/services/client.service';
import { ServiceBeauteService } from '../../core/services/service-beaute.service';
import { ProduitService } from '../../core/services/produit.service';
import { RendezVous, STATUT_LABELS, STATUT_COLORS } from '../../core/models/appointment.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  services: any[]= [];
  produits: any[]= [];
  //stats = { total: 0, aujourd_hui: 0, ce_mois: 0, termines: 0 };
  stats = { total: 0, aujourd_hui: 0, ce_mois: 0, termines: 0, montant_total: 0, montant_rdv: 0, montant_commandes: 0 };
  rdvAujourdHui: RendezVous[] = [];
  totalClients = 0;
  totalServices = 0;
  //prodStockBas = 0;
  stockTotal = 0;
  //loading = true;
  loading = true;
  updatingId: number | null = null;
  currentUser$ = this.authService.currentUser$;

  STATUT_LABELS = STATUT_LABELS;
  STATUT_COLORS = STATUT_COLORS;

  constructor(
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private serviceBeauteService: ServiceBeauteService,
    private produitService: ProduitService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.appointmentService.getStatistiques().subscribe(s => {
      this.stats = s;
    });

    this.appointmentService.getAujourdHui().subscribe(rdvs => {
      this.rdvAujourdHui = rdvs;
      this.loading = false;
    });
    this.serviceBeauteService.getAll().subscribe(data => {
    this.services = data.slice(0, 4);
    });

    this.produitService.getAll().subscribe(data => {
      this.produits = data.slice(0, 4);
      this.stockTotal = data.reduce((sum, p) => sum + (p.stock || 0), 0);
    });
    this.clientService.getAll().subscribe(c => this.totalClients = c.length);
    this.serviceBeauteService.getAll().subscribe(s => this.totalServices = s.length);
    //this.produitService.getStockBas().subscribe(p => this.prodStockBas = p.length);
  }

  getBadgeClass(statut: string): string {
    return `badge badge-${(STATUT_COLORS as any)[statut] || 'secondary'}`;
  }

  changerStatut(rdv: RendezVous, statut: 'confirme' | 'annule'): void {
    if (!rdv.id) return;
    this.updatingId = rdv.id;
    this.appointmentService.update(rdv.id, { statut }).subscribe({
      next: () => {
        this.updatingId = null;
        this.loadData();
      },
      error: () => { this.updatingId = null; }
    });
  }
}

