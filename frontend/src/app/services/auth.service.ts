import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {LoginRequest, LoginResponse} from '../models/auth.model';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          console.log('Auth service response:', response);
          if (response && response.jwt) {  // Changed from response.token to response.jwt
            localStorage.setItem('token', response.jwt);  // Still store it as 'token' in localStorage
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    // console.log('Getting token from storage:', token);
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserEmail(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        return decodedToken.sub;  // 'sub' je email u JWT tokenu
      } catch {
        return null;
      }
    }
    return null;
  }
}
