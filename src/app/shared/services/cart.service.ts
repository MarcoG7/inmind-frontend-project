import { computed, Injectable, signal } from '@angular/core';
import { ICartItem } from '../interfaces/cart-item.interface';
import { IProduct } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartItems = signal<ICartItem[]>([]);

  // updates whenever changes are detected in cartItems
  cartCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  cartTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  addToCart(product: IProduct, size?: string, color?: string, quantity: number = 1): void {
    const productExists = this.cartItems().find((item) => item.product.id === product.id);

    if (productExists) {
      this.cartItems.update((items) =>
        items.map((item) => {
          if (item.product.id === product.id) {
            return { ...item, quantity: item.quantity + quantity };
          } else {
            return item;
          }
        }),
      );
    } else {
      this.cartItems.update((items) => [...items, { product, quantity, size, color }]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.update((items) => items.filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
