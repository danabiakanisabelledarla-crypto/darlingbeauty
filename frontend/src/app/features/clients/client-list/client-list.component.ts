import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error = '';
  success = '';
  searchQuery = '';
  deleteConfirmId: number | null = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.clientService.getAll(this.searchQuery).subscribe({
      next: data => { this.clients = data; this.loading = false; },
      error: () => { this.error = 'Erreur lors du chargement des clients.'; this.loading = false; }
    });
  }

  onSearch(): void { this.load(); }

  confirmDelete(id: number): void { this.deleteConfirmId = id; }
  cancelDelete(): void { this.deleteConfirmId = null; }

  delete(id: number): void {
    this.clientService.delete(id).subscribe({
      next: () => {
        this.success = 'Client supprimé avec succès.';
        this.deleteConfirmId = null;
        this.load();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Erreur lors de la suppression.'; this.deleteConfirmId = null; }
    });
  }
}
