import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly API = environment.apiUrl + '/clients';

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Client[]>(`${this.API}/`, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API}/${id}/`);
  }

  create(data: Client): Observable<Client> {
    return this.http.post<Client>(`${this.API}/`, data);
  }

  update(id: number, data: Client): Observable<Client> {
    return this.http.put<Client>(`${this.API}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}/`);
  }
}
