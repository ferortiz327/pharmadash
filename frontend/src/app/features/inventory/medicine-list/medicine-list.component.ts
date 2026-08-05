import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.scss'
})
export class MedicineListComponent implements OnInit {
  medicines: any[] = [];
  loading = true;
  error = '';
  pagination: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(page: number = 1): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/medicines?page=${page}&limit=10`).subscribe({
      next: (response: any) => {
        this.medicines = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar medicamentos';
        this.loading = false;
      }
    });
  }

  deleteMedicine(id: string): void {
    if (confirm('¿Estás seguro de eliminar este medicamento?')) {
      this.http.delete(`${environment.apiUrl}/medicines/${id}`).subscribe({
        next: () => {
          this.loadMedicines();
        },
        error: () => {
          alert('Error al eliminar el medicamento');
        }
      });
    }
  }

  getCategoryClass(category: string): string {
    const classes: any = {
      'GENERIC': 'badge-generic',
      'ANTIBIOTIC': 'badge-antibiotic',
      'COLD_CHAIN': 'badge-cold-chain'
    };
    return classes[category] || '';
  }
}
