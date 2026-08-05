
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { MedicineListComponent } from './features/inventory/medicine-list/medicine-list.component';
import { MedicineFormComponent } from './features/inventory/medicine-form/medicine-form.component';
import { SaleFormComponent } from './features/sales/sale-form/sale-form.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    MedicineListComponent,
    MedicineFormComponent,
    SaleFormComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'medicines', component: MedicineListComponent, canActivate: [AuthGuard] },
      { path: 'medicines/new', component: MedicineFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'medicines/:id/edit', component: MedicineFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'sales', component: SaleFormComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '/dashboard' }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
