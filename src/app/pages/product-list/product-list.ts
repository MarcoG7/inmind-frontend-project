import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { WishListService } from '../../shared/services/wishlist.service';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCard, TitleCasePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishListService = inject(WishListService);
  private route = inject(ActivatedRoute);

  allProducts = toSignal(this.productService.getProducts(), { initialValue: [] });
  categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  private urlParams = toSignal(this.route.queryParams, { initialValue: {} });

  selectedCategories = signal<string[]>(
    [this.route.snapshot.queryParamMap.get('category')].filter(Boolean) as string[],
  );
  priceMin = signal(0);
  priceMax = signal(1000);
  sortBy = signal('featured');

  productMaxPrice = computed(() => {
    const products = this.allProducts();
    if (!products.length) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  });

  searchQuery = computed(() => (this.urlParams() as Record<string, string>)['search'] ?? '');

  filteredProducts = computed(() => {
    let products = this.allProducts();

    const selectedCategories = this.selectedCategories();
    if (selectedCategories.length > 0) {
      products = products.filter((p) => selectedCategories.includes(p.category));
    }

    const search = this.searchQuery().toLowerCase().trim();
    if (search) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search),
      );
    }

    products = products.filter((p) => p.price >= this.priceMin() && p.price <= this.priceMax());

    const sort = this.sortBy();
    if (sort === 'price-asc') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products = [...products].sort((a, b) => b.rating.rate - a.rating.rate);
    }

    return products;
  });

  pageTitle = computed(() => {
    const search = this.searchQuery();
    if (search) return `Search results for "${search}"`;
    const cats = this.selectedCategories();
    if (cats.length === 1) return cats[0].charAt(0).toUpperCase() + cats[0].slice(1);
    return 'Shop All Products';
  });

  toggleCategory(category: string): void {
    this.selectedCategories.update((cats) =>
      cats.includes(category) ? cats.filter((c) => c !== category) : [...cats, category],
    );
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.priceMax.set(this.productMaxPrice());
  }

  addToCart(product: IProduct): void {
    this.cartService.addToCart(product);
  }

  addToWishList(product: IProduct): void {
    this.wishListService.addToWishList(product);
  }
}
