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
  mostrarModal = false;
  itemSeleccionado: any = null;
  activeSegment: string = 'all'; // Variable para controlar el segmento activo
  pendientes: encuestasObtener[] = [];
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
      observaciones_supervisor: '',
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
    

    guardarCambios() {
      this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id}`, this.encuestaSeleccionada)
        .subscribe(() => {
          this.mostrarModal = false;
          this.cargarPendientes(); // recargar la tabla
        });
    }

    editarEncuesta(encuestaSeleccionada: encuestasObtener) {
      this.encuesta = {
        id_empresa: encuestaSeleccionada.idEmpresa,
        id_operativo: encuestaSeleccionada.idOperativo,
        ingresador: encuestaSeleccionada.ingresador,
        analista: encuestaSeleccionada.analista,
        fecha_entrega: encuestaSeleccionada.fecha_entrega,
        fecha_recupero: encuestaSeleccionada.fecha_recupero,
        fecha_supervision: encuestaSeleccionada.fecha_supervision,
        fecha_ingreso: encuestaSeleccionada.fecha_ingreso,
        medio: encuestaSeleccionada.medio,
        estado: encuestaSeleccionada.estado,
        observaciones_analista: encuestaSeleccionada.observaciones_analista,
        observaciones_ingresador: encuestaSeleccionada.observaciones_ingresador,
        // estado_validacion: encuestaSeleccionada.estado_validacion,
        // observaciones_validacion: encuestaSeleccionada.observaciones_validacion,
        referente: encuestaSeleccionada.referente,
      };
      this.mostrarModal = true;
    }
    
    
    abrirModal(item: any) {
      this.itemSeleccionado = item;
      this.mostrarModal = true;
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
