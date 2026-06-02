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


  
  adminNavItems = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
  { label: 'Rendez-vous', icon: 'bi-calendar-check', route: '/appointments' },
  { label: 'Clients', icon: 'bi-people', route: '/clients' },
  { label: 'Services', icon: 'bi-scissors', route: '/services' },
  { label: 'Produits', icon: 'bi-bag', route: '/products' },
  { label: 'Commandes', icon: 'bi-cart-check', route: '/orders' }
];

clientNavItems = [
  {
    label: 'Accueil',
    icon: 'bi-house',
    route: '/client-dashboard'
  },
  {
    label: 'Services',
    icon: 'bi-stars',
    route: '/client-dashboard/services'
  },
  {
    label: 'Mes rendez-vous',
    icon: 'bi-calendar-check',
    route: '/client-dashboard/appointments'
  },
];

get navItems() {
  return this.currentUser?.is_staff
    ? this.adminNavItems
    : this.clientNavItems;
}

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      if (!isAuthenticated) this.sidebarOpen = false;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      //console.log('Utilisateur connecté :');
      //console.log(user);
      //console.log('is_staff = ', user?.is_staff);
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

