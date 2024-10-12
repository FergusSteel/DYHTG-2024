import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: CallbackComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default route
];
