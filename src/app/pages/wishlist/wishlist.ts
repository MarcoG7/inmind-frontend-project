import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WishListService } from '../../shared/services/wishlist.service';
import { CartService } from '../../shared/services/cart.service';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  wishListService = inject(WishListService);
  private cartService = inject(CartService);

  moveToCart(product: IProduct): void {
    this.cartService.addToCart(product);
    this.wishListService.removeFromCart(product.id);
  }

  removeItem(productId: number): void {
    this.wishListService.removeFromCart(productId);
  }
}
