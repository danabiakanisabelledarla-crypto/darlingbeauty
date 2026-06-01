import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/auth.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = false;
  currentUser: User | null = null;
  isLoggedIn = false;
  sidebarOpen = false;

  navItems = [
    { label: 'Tableau de bord', icon: 'bi-speedometer2', route: '/dashboard' },
    { label: 'Rendez-vous', icon: 'bi-calendar-check', route: '/appointments' },
    { label: 'Clients', icon: 'bi-people', route: '/clients' },
    { label: 'Services', icon: 'bi-scissors', route: '/services' },
    { label: 'Produits', icon: 'bi-bag', route: '/products' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.isLoading = true;
      if (event instanceof NavigationEnd) {
        this.isLoading = false;
        this.sidebarOpen = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
