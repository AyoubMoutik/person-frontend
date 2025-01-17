import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  username: string;
  authdata: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private baseUrl = 'http://localhost:8082/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  validateSession(): Observable<boolean> {
    if (!this.currentUserValue) {
      return of(false);
    }

    const headers = this.getAuthHeader();
    return this.http.get(`${this.baseUrl}/person`, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        return of(false);
      })
    );
  }

  login(username: string, password: string) {
    const authString = `${username}:${password}`;
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(authString));

    return this.http.get<{roles: string[]}>(`${this.baseUrl}/user/roles`, { headers }).pipe(
      map(response => {
        const user: User = { 
          username, 
          authdata: btoa(authString),
          roles: response.roles 
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Authentication failed'));
      })
    );
  }

  logout() {
    // Clear localStorage
    localStorage.removeItem('currentUser');
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthHeader(): HttpHeaders {
    const user = this.currentUserValue;
    if (user && user.authdata) {
      return new HttpHeaders()
        .set('Authorization', 'Basic ' + user.authdata)
        .set('Content-Type', 'application/json');
    }
    return new HttpHeaders();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user && user.roles && user.roles.includes('ROLE_' + role);
  }
}
