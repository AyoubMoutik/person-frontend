import { Routes } from '@angular/router';
import { PersonListComponent } from './person-list/person-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/persons', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'persons', component: PersonListComponent, canActivate: [AuthGuard] }
];
