import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, TokenResponse, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private authStateSubject = new BehaviorSubject<boolean>(this.hasStoredToken());

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.loadCurrentUser().catch(() => this.clearSession());
    }
  }

  login(data: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.API}/login/`, data).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.authStateSubject.next(true);
        this.loadCurrentUser().catch(() => this.clearSession());
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API}/register/`, data);
  }

  logout(): void {
    const refresh = localStorage.getItem('refresh_token');
    this.http.post(`${this.API}/logout/`, { refresh }).subscribe();
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  loadCurrentUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    this.http.get<User>(`${this.API}/me/`).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        resolve(user);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.authStateSubject.next(true);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private hasStoredToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.authStateSubject.next(false);
  }
}
