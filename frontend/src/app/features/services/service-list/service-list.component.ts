import { Component, OnInit } from '@angular/core';
import { ServiceBeauteService } from '../../../core/services/service-beaute.service';
import { Service } from '../../../core/models/service.model';

@Component({ selector: 'app-service-list', templateUrl: './service-list.component.html', styleUrls: ['./service-list.component.scss'] })
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  error = '';
  success = '';
  deleteConfirmId: number | null = null;

  constructor(private serviceBeauteService: ServiceBeauteService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.serviceBeauteService.getAll().subscribe({
      next: d => { this.services = d; this.loading = false; },
      error: () => { this.error = 'Erreur de chargement.'; this.loading = false; }
    });
  }

  confirmDelete(id: number): void { this.deleteConfirmId = id; }
  cancelDelete(): void { this.deleteConfirmId = null; }

  delete(id: number): void {
    this.serviceBeauteService.delete(id).subscribe({
      next: () => { this.success = 'Service supprimé.'; this.deleteConfirmId = null; this.load(); setTimeout(() => this.success = '', 3000); },
      error: () => { this.error = 'Erreur lors de la suppression.'; this.deleteConfirmId = null; }
    });
  }
}
