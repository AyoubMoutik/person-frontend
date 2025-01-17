import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';  // Updated import path

export interface NewPersonne {
  nom: string;
  prenom: string;
}

export interface Personne extends NewPersonne {
  num: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8082/api/person';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  getPersonnes(): Observable<Personne[]> {
    return this.http.get<Personne[]>(this.apiUrl, { 
      headers: this.authService.getAuthHeader() 
    }).pipe(catchError(this.handleError));
  }

  addPersonne(personne: NewPersonne): Observable<Personne> {
    return this.http.post<Personne>(this.apiUrl, personne, { 
      headers: this.authService.getAuthHeader() 
    }).pipe(catchError(this.handleError));
  }

  updatePersonne(personne: Personne): Observable<Personne> {
    return this.http.put<Personne>(`${this.apiUrl}/${personne.num}`, personne, { 
      headers: this.authService.getAuthHeader() 
    }).pipe(catchError(this.handleError));
  }

  deletePersonne(num: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${num}`, { 
      headers: this.authService.getAuthHeader() 
    }).pipe(catchError(this.handleError));
  }
}
