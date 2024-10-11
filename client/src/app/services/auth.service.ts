import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'signin';
  private tokenKey = 'authToken';
  private signUp = 'signup';
  private signOut = 'signout';
  private userRole = 'userRole';

  constructor(private apiClient: ApiService) {}

  // Login and store token on success
  login(email: string, password: string): Observable<any> {
    return this.apiClient.postData(this.loginUrl, { email, password }).pipe(
      tap((response: any) => {
        if (response.result.jwt) {
          localStorage.setItem(this.tokenKey, response.result.jwt); // Store token
        }

        localStorage.setItem(this.userRole, response.result.user.role);
      })
    );
  }

  signup(email: string, password: string): Observable<any> {
    return this.apiClient.postData(this.signUp, { email, password }).pipe(
      tap((response: any) => {
        if (response.result.jwt) {
          localStorage.setItem(this.tokenKey, response.result.jwt); // Store token
        }
      })
    );
  }

  // Check if user is logged in by checking token existence
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  // Logout user by clearing token
  logout(): void {
    this.apiClient.postData(this.signOut, {}).pipe(
      tap((response: any) => {
        localStorage.removeItem(this.tokenKey);
      })
    );
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRole);
  }
}
