import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map, tap } from 'rxjs';
import { ILoginResponse } from '../../shared/interfaces/auth-login-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);

  private readonly BASE_URL = 'https://melaine-palaeobiologic-savourily.ngrok-free.dev/api';
  private readonly tokenKey = 'token';

  // get token from browser cookie
  getToken(): string {
    return this.cookieService.get(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userRole ?? null;
    } catch {
      return null;
    }
  }

  // save token to cookie with 300 seconds expiry
  private setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, 300);
  }

  authenticate(email: string, password: string) {
    return this.http.post<ILoginResponse>(`${this.BASE_URL}/auth/login`, { email, password }).pipe(
      tap((res) => {
        if (!res.token) return;
        this.setToken(res.token);
      }),
      map((res) => res.token),
    );
  }

  register(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    role?: string,
  ) {
    const body = new FormData();
    body.append('firstName', firstName);
    body.append('lastName', lastName);
    body.append('username', username);
    body.append('email', email);
    body.append('password', password);
    if (role) body.append('role', role); // role is optional
    return this.http.post(`${this.BASE_URL}/auth/register`, body);
  }

  logout(): void {
    this.cookieService.delete(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
