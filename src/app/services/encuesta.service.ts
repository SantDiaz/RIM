  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Campo, DatoControl, encuestas, ResumenRim, TasaNoRespuesta } from '../Interfaces/models';

  @Injectable({
    providedIn: 'root'
  })
  export class EncuestaService {

      DatosControl: DatoControl[] = [];

    private apiUrl = 'http://localhost:8080/api';  // Update with your backend API URL
     private apiUrl2 = 'http://localhost:8080/api/findDatosControl';

  private apiUrl3 = 'http://localhost:8080/api/resumenRim';
  private apiUrl4 = 'http://localhost:8080/api/campos';
  private apiUrl5 = 'http://localhost:8080/api/tasas';

    constructor(private http: HttpClient) { }

    saveEncuesta(encuesta: encuestas): Observable<any> {
      return this.http.post(this.apiUrl, encuesta);
    }

     obtenerDatos(): Observable<DatoControl[]> {
    return this.http.get<DatoControl[]>(this.apiUrl2);
  }

  obtenerResumenRim(): Observable<ResumenRim[]> { // <-- Usa la nueva interfaz
    return this.http.get<ResumenRim[]>(this.apiUrl3);
  }

  obtenerCampos(): Observable<Campo[]> { // <-- Usa la nueva interfaz
    return this.http.get<Campo[]>(this.apiUrl4);
  }

  obtenerTasas(): Observable<TasaNoRespuesta[]> { // <-- Usa la nueva interfaz
    return this.http.get<TasaNoRespuesta[]>(this.apiUrl5);
  }
}