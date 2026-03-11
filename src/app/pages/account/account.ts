import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

interface IPaymentMethod {
  id: number;
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  activeTab = signal<'details' | 'payment'>('details');
  isEditing = signal(false);

  profileForm = this.fb.group({
    fullName: [''],
    email: [''],
    phone: [''],
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
    country: [''],
  });

  paymentMethods = signal<IPaymentMethod[]>([
    { id: 1, last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: 2, last4: '8765', brand: 'Mastercard', expiry: '08/26', isDefault: false },
    { id: 3, last4: '3310', brand: 'Visa', expiry: '03/27', isDefault: false },
  ]);

  startEdit(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveModifications(): void {
    this.isEditing.set(false);
  }

  setDefault(id: number): void {
    this.paymentMethods.update((methods) => methods.map((m) => ({ ...m, isDefault: m.id === id })));
  }

  removeMethod(id: number): void {
    this.paymentMethods.update((methods) => methods.filter((m) => m.id !== id));
  }

  logout(): void {
    this.authService.logout();
  }
}
