import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encuestas, encuestasObtener } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-val',
  templateUrl: './home-val.component.html',
  styleUrls: ['./home-val.component.css']
})
export class HomeValComponent implements OnInit {
  mostrarModal = false;
  itemSeleccionado: any = null;
 activeSegment: string = 'all'; // Variable para controlar el segmento activo
  pendientes: encuestasObtener[] = [];
  encuestaSeleccionada: any = {};
      username: string = '';

  constructor(private encuestaService: EncuestaService, private router: Router, private http: HttpClient  ) { }

  ngOnInit(): void {
     this.username = localStorage.getItem('username') || '';

  }

  // Estados a enviar
  estados = [
    'Recepcionado',
    'Validado',
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

    
 
guardarCambios() {
  const idEmpresa = this.encuestaSeleccionada.id_empresa;
  const url = `http://localhost:8080/api/${idEmpresa}/updateEncuestaIngresador`;

  this.http.put(url, this.encuestaSeleccionada).subscribe(() => {
    
    // ✅ Actualizar solo el registro modificado en el array 'pendientes'
    const index = this.pendientes.findIndex(p => p.idEmpresa === idEmpresa);
    if (index !== -1) {
      this.encuestaSeleccionada.fecha_mod_estado = new Date(); // Actualizar la fecha en el frontend
      this.pendientes[index] = {
        ...this.pendientes[index],
        ...this.encuestaSeleccionada
      };
    }

    console.log('Encuesta actualizada:', this.encuestaSeleccionada);
    this.cerrarModal(); // Cerrar el modal
  });
}



  verEncuesta(idEncuesta: number) {
    this.http.get(`http://localhost:8080/api/${idEncuesta}`).subscribe((data: any) => {
      this.encuestaSeleccionada = data.encuesta;
      console.log('Encuesta seleccionada:', this.encuestaSeleccionada);
      this.mostrarModal = true;
    });
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
