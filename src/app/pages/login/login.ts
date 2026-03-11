import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;
    this.authService.authenticate(email!, password!).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: () => {
        this.error.set('Invalid email or password. Please try again.');
        this.loading.set(false);
      },
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
