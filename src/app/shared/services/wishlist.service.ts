import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { IWishListItem } from '../interfaces/wishlist-item.interface';

@Injectable({ providedIn: 'root' })
export class WishListService {
  wishListItems = signal<IWishListItem[]>([]);

  wishListCount = computed(() => this.wishListItems().length);

  addToWishList(product: IProduct): void {
    const productExists = this.wishListItems().find((item) => item.product.id === product.id);

    if (!productExists) {
      this.wishListItems.update((items) => [...items, { product }]);
    }
  }

  removeFromCart(productId: number): void {
    this.wishListItems.update((items) => items.filter((item) => item.product.id !== productId));
  }

  clearCart(): void {
    this.wishListItems.set([]);
  }
}
