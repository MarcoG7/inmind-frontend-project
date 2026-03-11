import { Component, computed, input, output } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<IProduct>();
  addToCart = output<IProduct>();
  addToWishlist = output<IProduct>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    this.addToCart.emit(this.product());
  }

  onAddToWishlist(event: Event): void {
    event.preventDefault();
    this.addToWishlist.emit(this.product());
  }

  // Returns an array of 5 booleans showing which stars should be filled
  starsFilled = computed(() =>
    Array.from({ length: 5 }, (_, i) => i < Math.round(this.product().rating.rate)),
  );
}
