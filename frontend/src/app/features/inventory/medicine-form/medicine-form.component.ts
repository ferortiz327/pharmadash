import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-medicine-form',
  templateUrl: './medicine-form.component.html',
  styleUrl: './medicine-form.component.scss'
})
export class MedicineFormComponent implements OnInit {
  medicineForm: FormGroup;
  loading = false;
  error = '';
  isEdit = false;
  medicineId = '';

  categories = [
    { value: 'GENERIC', label: 'Genérico' },
    { value: 'ANTIBIOTIC', label: 'Antibiótico' },
    { value: 'COLD_CHAIN', label: 'Cadena de Frío' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.medicineForm = this.fb.group({
      sku: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: ['GENERIC', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      expirationDate: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.medicineId = params['id'];
        this.loadMedicine();
      }
    });
  }

  loadMedicine(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/medicines/${this.medicineId}`).subscribe({
      next: (response: any) => {
        const data = response.data;
        this.medicineForm.patchValue({
          sku: data.sku,
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
          expirationDate: data.expirationDate.split('T')[0],
          imageUrl: data.imageUrl
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el medicamento';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.medicineForm.invalid) {
      this.error = 'Por favor, completa todos los campos requeridos';
      return;
    }

    this.loading = true;

    // ✅ CORREGIDO: Convertir la fecha a formato ISO-8601
    const formValue = this.medicineForm.value;
    const data = {
      ...formValue,
      expirationDate: new Date(formValue.expirationDate).toISOString()
    };

    const request = this.isEdit
      ? this.http.put(`${environment.apiUrl}/medicines/${this.medicineId}`, data)
      : this.http.post(`${environment.apiUrl}/medicines`, data);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/medicines']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al guardar el medicamento';
      }
    });
  }
}
