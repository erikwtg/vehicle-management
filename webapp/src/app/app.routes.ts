import { Routes } from '@angular/router';
import { List } from './vehicles/components/list/list';

export const routes: Routes = [
  { path: '', redirectTo: '/vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: List },
  { path: '**', redirectTo: '/vehicles' },
];
