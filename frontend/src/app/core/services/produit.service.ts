import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produit } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private readonly API = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.API}/`);
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.API}/${id}/`);
  }

  create(data: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.API}/`, data);
  }

  update(id: number, data: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.API}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}/`);
  }

  getStockBas(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.API}/stock_bas/`);
  }
}
