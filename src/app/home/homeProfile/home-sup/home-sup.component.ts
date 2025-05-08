import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encuestas, encuestasObtener } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';

@Component({
  selector: 'app-home-sup',
  templateUrl: './home-sup.component.html',
  styleUrls: ['./home-sup.component.css']
})
export class HomeSupComponent implements OnInit {

  activeSegment: string = 'all'; // Variable para controlar el segmento activo
  pendientes: encuestasObtener[] = [];
  mostrarModal: boolean = false;
  encuestaSeleccionada: any = {};
  constructor(private encuestaService: EncuestaService, private router: Router, private http: HttpClient ) { }

  ngOnInit(): void {

  }

  // Estados a enviar
  estados = [
    'No encontrado (no existe)' ,
    'Cierre definitivo' ,
    'Rechazado',
    'Ausente',
    'Entregado',
    'Recepcionado',
    'Pre-validado',
  ];




    encuesta: encuestas = {
      id_operativo: 0,
      id_empresa: 0,
      ingresador: '',
      analista: '',
      fecha_entrega: new Date(),
      fecha_recupero: new Date(),
      fecha_supervision: new Date(),
      fecha_ingreso: new Date(),  // No será visible
      medio: 'PAPEL',
      observaciones_ingresador: '',
      observaciones_analista: '',
      anio: '2024', 
    };
  
    idEmpresa: number = 0 ;

    // Método para cambiar de segmento
    toggleSegment(segment: string) {
      this.activeSegment = segment;
    
      if (segment === 'favorites') {
        this.cargarPendientes();
      }
    }
    


    cargarPendientes() {
      const estadosParam = this.estados.map(estado => `estado=${encodeURIComponent(estado)}`).join('&');
      const url = `http://localhost:8080/api/filtrar?${estadosParam}`;
    
      console.log('URL construida:', url);
    
      this.http.get<any[]>(url).subscribe({
        next: data => {
          console.log('Datos recibidos:', data);
            
          this.pendientes = data;

        },
        error: err => {
          console.error('Error al cargar pendientes:', err);
        }
      });
    }
    
    verEncuesta(idEncuesta: number) {
      this.http.get(`http://localhost:8080/api/${idEncuesta}`).subscribe((data: any) => {
        this.encuestaSeleccionada = data.encuesta;
        this.mostrarModal = true;
      });
    }

    guardarCambios() {
      this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id}`, this.encuestaSeleccionada)
        .subscribe(() => {
          this.mostrarModal = false;
          this.cargarPendientes(); // recargar la tabla
        });
    }

    cerrarModal() {
      this.mostrarModal = false;
      this.encuestaSeleccionada = {};
    }

    onSubmit() {


      this.encuestaService.saveEncuesta(this.encuesta).subscribe({
        next: (response) => {
          console.log('Encuesta saved successfully:', response);
          this.encuesta.anio = '2024';
          // Suponiendo que el id_empresa viene en el response
          const idEmpresa = response.id_empresa;
  
          // Redirigir al componente 'oneComponent' con id_empresa como parámetro
          this.router.navigate(['/one', idEmpresa]);
        },
        error: (error) => {
          console.error('Error saving encuesta:', error);
        }
      });
    }
    
  nextStep() {
    console.log(this.encuesta);
    this.onSubmit();  // Save the form data when moving to the next step
  }
}
