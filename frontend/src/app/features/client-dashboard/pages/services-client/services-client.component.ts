import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceBeauteService } from '../../../../core/services/service-beaute.service';
import { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-services-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-client.component.html',
  styleUrl: './services-client.component.scss'
})
export class ServicesClientComponent implements OnInit {
  services: Service[] = [];
  loading = false;
  errorMsg = '';

  constructor(private serviceBeaute: ServiceBeauteService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.serviceBeaute.getAll().subscribe({
      next: (data) => {
        this.services = data.filter(s => s.actif !== false);
        this.loading = false;
      },
      error: () => { this.errorMsg = 'Impossible de charger les services.'; this.loading = false; }
    });
  }

  formatDuree(minutes: number): string {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
  }
}