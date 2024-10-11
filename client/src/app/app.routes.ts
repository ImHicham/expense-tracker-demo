import { Routes } from '@angular/router';
import { SheetDetailComponent } from './components/sheet-detail/sheet-detail.component';
import { SheetListItem } from './components/sheet-list-item/sheet-list-item.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: SheetListItem, canActivate: [AuthGuard] },
  {
    path: 'sheet/:id',
    component: SheetDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Default route
];
