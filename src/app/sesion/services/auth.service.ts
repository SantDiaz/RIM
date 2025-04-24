

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api'; // Ajusta según tu URL del backend
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // this.checkCurrentUser();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, { username, password })
      .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }, { withCredentials: true })
      .pipe(
        tap(user => {
          // Guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          // Actualizar el BehaviorSubject
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }
  
  // logout(): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
  //     .pipe(
  //       tap(() => {
  //         this.currentUserSubject.next(null);
  //       }),
  //       catchError(this.handleError)
  //     );
  // }
  
  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }


  checkCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      this.userSubject.next(null);
      return;
    }

    const user = JSON.parse(storedUser);
    
    // Opcional: Verificar con el backend si el usuario sigue siendo válido
    this.http.get(`${this.apiUrl}/current-user`, {
      params: { username: user.username }
    }).subscribe({
      next: (response: any) => {
        if (response.authenticated === true) {
          this.userSubject.next(response);
        } else {
          // Si el servidor dice que no está autenticado, limpiar datos locales
          this.logout();
        }
      },
      error: () => {
        this.logout();
      }
    });
  }

  
  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.authenticated;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.roles && currentUser.roles.includes(role);
  }

  private handleError(error: any) {
    console.error('Error en la operación:', error);
    let errorMessage = 'Ocurrió un error';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }



  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }





  assignRole(userId: number, roleName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/assign-role`, { roleName });
  }
}


