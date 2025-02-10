import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { OrderCreateComponent } from './components/orders/order-create/order-create.component';
import { DishListComponent } from './components/orders/dish-list/dish-list.component';
import { ErrorListComponent } from './components/errors/error-list/error-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserListComponent,
    UserFormComponent,
    UserEditComponent,
    NavbarComponent,
    OrderListComponent,
    OrderCreateComponent,
    DishListComponent,
    ErrorListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
