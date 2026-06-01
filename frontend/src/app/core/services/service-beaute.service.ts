import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Service, Categorie } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceBeauteService {
  private readonly API = environment.apiUrl + '/services';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.API}/`);
  }

  getById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.API}/${id}/`);
  }

  create(data: Service): Observable<Service> {
    return this.http.post<Service>(`${this.API}/`, data);
  }

  update(id: number, data: Service): Observable<Service> {
    return this.http.put<Service>(`${this.API}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}/`);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.API}/categories/`);
  }

  createCategorie(data: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.API}/categories/`, data);
  }
}
