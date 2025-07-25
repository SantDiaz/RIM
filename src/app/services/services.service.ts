import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {   cantidadTrabajadores, Datos_referente, DatosEmpresa, DatosRespondiente, horasExtras, horasNormales, InsumosBasicos, investigacionDesarrollo, manoDeObra, perspectiva, produccion, remuneraciones_cargas, servicios_basicos, UtilizacionInsumos, UtilizacionServicio, ventas } from 'src/app/Interfaces/models';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private baseUrl = 'http://localhost:8080/api'; // Assuming your Spring Boot app runs on port 8080
  private baseUrl2 = 'http://localhost:8080/apiTwo'; // Assuming your Spring Boot app runs on port 8080
  private baseUrl3 = 'http://localhost:8080/apiThree'; // Assuming your Spring Boot app runs on port 8080
  private baseUrl4 = 'http://localhost:8080/apiFour'; // Assuming your Spring Boot app runs on port 8080

  idEmpresa: number = 0;    

  constructor(private http: HttpClient) { }
 
 

  enviarDatosEmpresa(datosEmpresa: DatosEmpresa): Observable<DatosEmpresa> {
    const idEmpresa = datosEmpresa.id_empresa; 
    return this.http.post<DatosEmpresa>(`${this.baseUrl}/${idEmpresa}/datosempresa`, datosEmpresa);
  }

  enviarDatosRespondiente(datosRespondiente: DatosRespondiente): Observable<DatosRespondiente> {
    const idEmpresa = datosRespondiente.id_empresa;
    return this.http.post<DatosRespondiente>(`${this.baseUrl}/${idEmpresa}/respondiente`, datosRespondiente);
  }

  enviarDatosReferente(datosRefente: Datos_referente): Observable<Datos_referente> {
  const idEmpresa = datosRefente.id_empresa;
  return this.http.post<Datos_referente>(`${this.baseUrl}/${idEmpresa}/referente`, datosRefente);
}



  enviarDatosProduccion(produccionData: produccion): Observable<any> {
    const idEmpresa = produccionData.id_empresa;
    return this.http.post<produccion>(`${this.baseUrl}/${idEmpresa}/produccion`, produccionData);

  }

enviarDatosBienes(idEmpresa: number, bienInsumo: InsumosBasicos ) {
  return this.http.post(`${this.baseUrl}/${idEmpresa}/insumosBasicos`, bienInsumo);
}

enviarDatosServicios(idEmpresa: number, servicioUtilizacion: UtilizacionServicio) {
  return this.http.post(`${this.baseUrl}/${idEmpresa}/utilizacionServicios`, servicioUtilizacion);
}

enviarDatosServiciosBasicos(idEmpresa: number, insumosUtilizacion: UtilizacionInsumos) {
  return this.http.post(`${this.baseUrl}/${idEmpresa}/utilizacionInsumos`, insumosUtilizacion);
}

enviarManoDeObra(idEmpresa: number, manoObra: manoDeObra) {
  return this.http.post(`${this.baseUrl}/${idEmpresa}/manoDeObra`, manoObra);
}




// PASO 2
enviarCantidadTrabajadores(idEmpresa: number, cantidadTrabajadoresData: cantidadTrabajadores): Observable<any> {
  return this.http.post<cantidadTrabajadores>(`${this.baseUrl2}/${idEmpresa}/cantidadTrabajadores`, cantidadTrabajadoresData);
}

// Enviar datos de horas normales
enviarHorasNormales(idEmpresa: number, horasNormalesData: horasNormales): Observable<any> {
  return this.http.post<horasNormales>(`${this.baseUrl2}/${idEmpresa}/horasNormales`, horasNormalesData);
}

// Enviar datos de horas extras
enviarHorasExtras(idEmpresa: number, horasExtrasData: horasExtras): Observable<any> {
  return this.http.post<horasExtras>(`${this.baseUrl2}/${idEmpresa}/horasExtras`, horasExtrasData);
}

// PASO 3

createVenta( idEmpresa:number , venta: ventas): Observable<ventas> {
  return this.http.post<ventas>(`${this.baseUrl3}/${idEmpresa}/venta`, venta);
}

// PASO 4

enviarInvestigacionDesarrollo(idEmpresa:number , datos: investigacionDesarrollo): Observable<any> {
  return this.http.post(`${this.baseUrl4}/${idEmpresa}/investigacion`, datos);
}

enviarPerspectiva(idEmpresa:number ,datos: perspectiva): Observable<any> {
  return this.http.post(`${this.baseUrl4}/${idEmpresa}/perspectiva`, datos);
}
}
