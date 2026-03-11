import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../../shared/services/cart.service';
import { WishListService } from '../../../shared/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  cartService = inject(CartService);
  wishListService = inject(WishListService);
  private router = inject(Router);

  searchQuery = signal('');
  showUserMenu = signal(false);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  toggleUserMenu(): void {
    this.showUserMenu.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  search(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/shop'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/shop']);
    }
  }
}
