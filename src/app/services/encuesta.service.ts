  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { encuestas } from '../Interfaces/models';

  @Injectable({
    providedIn: 'root'
  })
  export class EncuestaService {

    private apiUrl = 'http://localhost:8080/api';  // Update with your backend API URL

    constructor(private http: HttpClient) { }

    saveEncuesta(encuesta: encuestas): Observable<any> {
      return this.http.post(this.apiUrl, encuesta);
    }

  }
