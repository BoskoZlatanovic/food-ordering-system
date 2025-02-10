import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import {AuthGuard} from "./guards/auth.guard";
import {OrderListComponent} from "./components/orders/order-list/order-list.component";
import {OrderCreateComponent} from "./components/orders/order-create/order-create.component";
import {DishListComponent} from "./components/orders/dish-list/dish-list.component";
import {ErrorListComponent} from "./components/errors/error-list/error-list.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/new',
    component: OrderCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dishes',
    component: DishListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'errors',
    component: ErrorListComponent,
    canActivate: [AuthGuard]
  },

  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: '**', redirectTo: '/orders' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
