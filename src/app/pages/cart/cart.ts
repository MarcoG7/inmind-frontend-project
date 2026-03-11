import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../shared/services/cart.service';
import { ICartItem } from '../../shared/interfaces/cart-item.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);

  readonly taxRate = 0.08;

  get subtotal(): number {
    return this.cartService.cartTotal();
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  increment(item: ICartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrement(item: ICartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  removeItem(item: ICartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }
}
