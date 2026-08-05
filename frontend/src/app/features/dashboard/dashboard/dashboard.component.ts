import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metrics: any = null;
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/dashboard/metrics`).subscribe({
      next: (response: any) => {
        this.metrics = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el dashboard';
        this.loading = false;
      }
    });
  }
}
