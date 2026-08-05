import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.scss'
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  medicines: any[] = [];
  cart: any[] = [];
  loading = false;
  error = '';
  total = 0;
  subtotal = 0;
  taxTotal = 0;
  searchResults: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.saleForm = this.fb.group({
      search: [''],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.http.get(`${environment.apiUrl}/medicines`).subscribe({
      next: (response: any) => {
        this.medicines = response.data;
      },
      error: () => {
        this.error = 'Error al cargar medicamentos';
      }
    });
  }

  searchMedicine(): void {
    const term = this.saleForm.get('search')?.value?.toLowerCase();
    if (!term) {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.medicines.filter(m =>
      m.name.toLowerCase().includes(term) ||
      m.sku.toLowerCase().includes(term)
    );
  }

  selectMedicine(medicine: any): void {
    const quantity = this.saleForm.get('quantity')?.value || 1;
    if (quantity > medicine.stock) {
      alert(`Stock insuficiente. Disponible: ${medicine.stock}`);
      return;
    }

    const existing = this.cart.find(item => item.id === medicine.id);
    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.quantity * existing.price;
      existing.tax = existing.subtotal * (existing.taxRate || 0);
      existing.total = existing.subtotal + existing.tax;
    } else {
      const taxRate = this.getTaxRate(medicine.category);
      const subtotal = quantity * medicine.price;
      const tax = subtotal * taxRate;
      this.cart.push({
        ...medicine,
        quantity: quantity,
        subtotal: subtotal,
        tax: tax,
        total: subtotal + tax,
        taxRate: taxRate
      });
    }

    this.updateTotals();
    this.saleForm.get('search')?.setValue('');
    this.searchResults = [];
    this.saleForm.get('quantity')?.setValue(1);
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.updateTotals();
  }

  updateTotals(): void {
    this.subtotal = this.cart.reduce((sum, item) => sum + item.subtotal, 0);
    this.taxTotal = this.cart.reduce((sum, item) => sum + item.tax, 0);
    this.total = this.subtotal + this.taxTotal;
  }

  getTaxRate(category: string): number {
    const rates: any = {
      'GENERIC': 0,
      'ANTIBIOTIC': 0.05,
      'COLD_CHAIN': 0.10
    };
    return rates[category] || 0;
  }

  processSale(): void {
    if (this.cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    this.loading = true;
    const saleData = {
      items: this.cart.map(item => ({
        medicineId: item.id,
        quantity: item.quantity
      }))
    };

    this.http.post(`${environment.apiUrl}/sales`, saleData).subscribe({
      next: () => {
        this.loading = false;
        alert('✅ Venta procesada exitosamente');
        this.cart = [];
        this.updateTotals();
        this.loadMedicines();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al procesar la venta';
      }
    });
  }

  formatCurrency(value: number): string {
    return '$' + value.toFixed(2);
  }
}
