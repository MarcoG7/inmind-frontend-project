import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { WishListService } from '../../shared/services/wishlist.service';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ProductCard, TitleCasePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishListService = inject(WishListService);

  allProducts = toSignal(this.productService.getProducts(), { initialValue: [] });
  categories = toSignal(this.productService.getCategories(), { initialValue: [] });

  featuredProducts = computed(() => this.allProducts().slice(0, 4));

  getCategoryImage(category: string): string {
    const catFirstProduct = this.allProducts().find((p) => p.category === category);
    if (catFirstProduct) {
      return catFirstProduct.image;
    } else {
      return '';
    }
  }

  addToCart(product: IProduct): void {
    this.cartService.addToCart(product);
  }

  addToWishList(product: IProduct): void {
    this.wishListService.addToWishList(product);
  }
}
