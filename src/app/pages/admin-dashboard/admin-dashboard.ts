import { Component, computed, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry, themeAlpine } from 'ag-grid-community';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/interfaces/product.interface';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private productService = inject(ProductService);

  allProducts = toSignal(this.productService.getProducts(), { initialValue: [] as IProduct[] });

  avgPrice = computed(() => {
    const products = this.allProducts();
    if (!products.length) return '0.00';
    return (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2);
  });

  totalReviews = computed(() =>
    this.allProducts().reduce((sum, p) => sum + p.rating.count, 0)
  );

  categoryStats = computed(() => {
    const products = this.allProducts();
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / max) * 100),
    }));
  });

  colDefs: ColDef<IProduct>[] = [
    { field: 'id', flex: 0.4 },
    { field: 'title', flex: 2 },
    { field: 'category', flex: 1 },
    { field: 'price', flex: 0.6, valueFormatter: p => '$' + p.value.toFixed(2) },
    { field: 'rating.rate', headerName: 'Rating', flex: 0.5 },
    { field: 'rating.count', headerName: 'Reviews', flex: 0.5 },
  ];

  defaultColDef: ColDef = { flex: 1, filter: true, sortable: true };

  theme = themeAlpine;
  pagination = true;
  paginationPageSize = 8;
  paginationPageSizeSelector = [8, 10, 20];
}
