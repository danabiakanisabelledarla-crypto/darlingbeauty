import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        alert('Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.');
      }
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';

    /*this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Identifiant ou mot de passe incorrect.';
        } else {
          this.error = 'Erreur de connexion. Veuillez réessayer.';
        }
      }
    });*/
    this.authService.login(this.form.value).subscribe({
      next: () =>  { setTimeout(() => {
        const user = this.authService.getCurrentUser();
        console.log('Utilisateur connecté :', user);
        if (user?.is_staff) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/client-dashboard']);
        }

      }, 500);
    },
    error: err => {
      this.loading = false;

      if (err.status === 401) {
        this.error = 'Identifiant ou mot de passe incorrect.';
      } else {
        this.error = 'Erreur de connexion. Veuillez réessayer.';
      }
    }
  });
  

  }}