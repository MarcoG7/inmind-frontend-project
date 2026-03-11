import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { WishListService } from '../../shared/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductCard, TitleCasePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);
  wishListService = inject(WishListService);

  product = toSignal(
    this.route.params.pipe(
      map((p) => Number(p['id'])),
      switchMap((id) => this.productService.getProductById(id)),
    ),
    { initialValue: null },
  );

  relatedProducts = toSignal(
    this.route.params.pipe(
      map((p) => Number(p['id'])),
      switchMap((id) => this.productService.getProductById(id)),
      switchMap((product) => this.productService.getProductsByCategory(product.category)),
      map((products) => products.filter((pr) => pr.id !== this.product()?.id).slice(0, 4)),
    ),
    { initialValue: [] },
  );

  selectedSize = signal('M');
  selectedColor = signal('Black');
  quantity = signal(1);
  selectedImageIndex = signal(0);

  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  colors = ['Black', 'Navy', 'White', 'Green', 'Gray'];

  thumbnails = computed(() => {
    const img = this.product()?.image ?? '';
    return img ? [img, img, img, img] : [];
  });

  starsFilled = computed(() => {
    const rate = this.product()?.rating?.rate ?? 0;
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rate));
  });

  increment(): void {
    this.quantity.update((q) => q + 1);
  }

  decrement(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(
        product,
        this.selectedSize(),
        this.selectedColor(),
        this.quantity(),
      );
    } else {
      return;
    }
  }

  addToWishList(): void {
    const product = this.product();
    if (product) {
      this.wishListService.addToWishList(product);
    } else {
      return;
    }
  }
}
