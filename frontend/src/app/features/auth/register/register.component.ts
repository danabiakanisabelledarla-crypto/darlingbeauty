import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../register/register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false ;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(g: FormGroup) {
    return g.get('password')?.value === g.get('password2')?.value
      ? null : { mismatch: true };
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    console.log("Bouton inscription cliqué");
    console.log(this.form.valid);
    console.log(this.form.value);
    
    console.log("Clique sur S'INSCRIRE");
    console.log("Formulaire valide:",this.form.valid);
    console.log(this.form.value);
    if (this.form.invalid) { 
      console.log("FPRMULAIRE INVALIDE");
      this.form.markAllAsTouched(); return; 
    }
    console.log("ENVOI AU BACKEND");

    this.authService.register(this.form.value).subscribe({
      /*next: () => {
        this.authService.login({
          username: this.form.value.username,
          password: this.form.value.password
        }).subscribe(() => this.router.navigate(['/dashboard']));
      },*/
      next: (res) => {
        console.log('Inscription réussie', res);
        this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
      },
      /*next: () => {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
      },*/
      error: err => {
        this.loading = false;
        const msgs = err.error;
        if (msgs?.username) this.error = msgs.username[0];
        else if (msgs?.password) this.error = msgs.password[0];
        else this.error = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      }
    });
  }
}
