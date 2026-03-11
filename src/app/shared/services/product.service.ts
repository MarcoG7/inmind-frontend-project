import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private BASE_URL = 'https://fakestoreapi.com';

  getProducts() {
    return this.http.get<IProduct[]>(`${this.BASE_URL}/products`);
  }

  getProductById(id: number) {
    return this.http.get<IProduct>(`${this.BASE_URL}/products/${id}`);
  }

  getCategories() {
    return this.http.get<string[]>(`${this.BASE_URL}/products/categories`);
  }

  getProductsByCategory(category: string) {
    return this.http.get<IProduct[]>(`${this.BASE_URL}/products/category/${category}`);
  }
}
