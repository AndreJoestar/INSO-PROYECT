import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TablesComponent } from './tables/tables.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'D\'Classic - Iniciar Sesión'
  },
  {
    path: 'tables',
    component: TablesComponent,
    title: 'D\'Classic - Mesas'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
