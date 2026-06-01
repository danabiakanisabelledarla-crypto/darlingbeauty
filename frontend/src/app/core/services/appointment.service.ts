import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RendezVous } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly API = environment.apiUrl + '/appointments';

  constructor(private http: HttpClient) {}

  getAll(statut?: string, date?: string): Observable<RendezVous[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (date) params = params.set('date', date);
    return this.http.get<RendezVous[]>(`${this.API}/`, { params });
  }

  getById(id: number): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.API}/${id}/`);
  }

  create(data: RendezVous): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.API}/`, data);
  }

  update(id: number, data: Partial<RendezVous>): Observable<RendezVous> {
    return this.http.patch<RendezVous>(`${this.API}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}/`);
  }

  getAujourdHui(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.API}/aujourd_hui/`);
  }

  getStatistiques(): Observable<any> {
    return this.http.get(`${this.API}/statistiques/`);
  }
}
