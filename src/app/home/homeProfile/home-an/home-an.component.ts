import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encuestas, encuestasObtener } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-an',
  templateUrl: './home-an.component.html',
  styleUrls: ['./home-an.component.css']
})
export class HomeAnComponent implements OnInit {
  pasoActual: number = 1;
  mostrarModal = false;
  itemSeleccionado: any = null;
  username: string = '';
  activeSegment: string = 'all'; // Variable para controlar el segmento activo
  pendientes: encuestasObtener[] = [];
  encuestaSeleccionada: any = {};
  constructor(private encuestaService: EncuestaService, private router: Router, private http: HttpClient  ) { }

  ngOnInit(): void {
         this.username = localStorage.getItem('username') || '';

  }


  // Estados a enviar
  estados = [
      'Ingresado',

  ];


   // Estados a enviar
  estados2 = [
      'No entregado' ,
      'No encontrado (no existe)' , 
      'Cierre definitivo' , 
      'Rechazado', 
      'Ausente', 
      'Entregado', 
      'Recepcionado', 
      'Pre-validado', 
      'Validado', 
      'Ingresado'

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
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;

  const index = this.pendientes.findIndex(p => p.idEmpresa === idEmpresa);
  this.encuestaSeleccionada.mod_usu = this.username
    if (index !== -1) {
      this.encuestaSeleccionada.fecha_mod_estado = new Date(); // Actualizar la fecha en el frontend
      this.pendientes[index] = {
        ...this.pendientes[index],
        ...this.encuestaSeleccionada,
      };
    }

const mostrarMensajeExito = () => {
  Swal.fire('¡Editado con éxito!', 'Los cambios fueron guardados correctamente.', 'success');
};

switch (this.pasoActual) {
  case 1:
    const url = `http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateEncuestaIngresador`;
    this.http.put(url, this.encuestaSeleccionada).subscribe({
      next: () => mostrarMensajeExito(),
      error: err => console.error(err)
    });
    break;

  case 2:
    this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosIdentificacionEmpresa`, this.encuestaSeleccionada.datosIdentificacionEmpresa)
      .subscribe({
        next: () => mostrarMensajeExito(),
        error: err => console.error(err)
      });
    break;

  case 3:
    this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosRespondiente`, this.encuestaSeleccionada.datosRespondiente)
      .subscribe({
        next: () => mostrarMensajeExito(),
        error: err => console.error(err)
      });
    break;

  case 4:
    this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosReferente`, this.encuestaSeleccionada.Datos_referente)
      .subscribe({
        next: () => mostrarMensajeExito(),
        error: err => console.error(err)
      });
    break;

  // Para los que llaman funciones como `guardarProduccion()`, pasales el callback:
  case 5:
    this.guardarProduccion(mostrarMensajeExito);
    break;
  case 6:
    this.guardarInsumosBasicos(mostrarMensajeExito);
    break;
  case 7:
    this.guardarManoDeObra(mostrarMensajeExito);
    break;
  case 8:
    this.guardarUtilizacionInsumos(mostrarMensajeExito);
    break;
  case 9:
    this.guardarUtilizacionServicios(mostrarMensajeExito);
    break;
  case 10:
    this.guardarCantidadTrabajadores(mostrarMensajeExito);
    break;
  case 11:
    this.guardarHorasNormales(mostrarMensajeExito);
    break;
  case 12:
    this.guardarHorasExtras(mostrarMensajeExito);
    break;
  case 13:
    this.guardarVentas(mostrarMensajeExito);
    break;
  case 14:
    this.guardarHorasNormales(mostrarMensajeExito);
    break;
  case 15:
    this.guardarPerspectiva(mostrarMensajeExito);
    break;

  default:
    console.log('Paso no manejado aún');
    break;
}
}


guardarProduccion(callback?: () => void) {
  // stepper 5 Tabla produccion
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const produccionModificada = this.encuestaSeleccionada?.produccion;
      if (callback) callback();

  if (!idEmpresa || !produccionModificada || produccionModificada.length === 0) {
    console.error("No hay datos de producción para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateProduccionMasiva`;

  this.http.put(url, produccionModificada).subscribe({
    next: () => console.log('Producción actualizada correctamente'),
    error: (error) => console.error('Error al actualizar producción', error)
  });
}

guardarInsumosBasicos(callback?: () => void) {
  // stepper 6 Tabla InsumosBasicos

  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.insumosBasicos;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos para guardar Insumos Básicos.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateInsumosMasiva`; // <- adaptá si es necesario

  this.http.put(url, datos).subscribe({
    next: () => console.log('Insumos Básicos actualizados correctamente'),
    error: (error) => console.error('Error al actualizar Insumos Básicos', error)
  });
}
guardarManoDeObra(callback?: () => void) {
  // stepper 7 Tabla ManodeObra
  
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const manoDeObraModificada = this.encuestaSeleccionada?.manoDeObra;
  if (callback) callback();

  if (!idEmpresa || !manoDeObraModificada || manoDeObraModificada.length === 0) {
    console.error("No hay datos de Mano de Obra para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateManoDeObraMasiva`;

  this.http.put(url, manoDeObraModificada).subscribe({
    next: () => console.log('Mano de Obra actualizada correctamente'),
    error: (error) => console.error('Error al actualizar Mano de Obra', error)
  });
}

guardarUtilizacionInsumos(callback?: () => void) {
  // stepper 8 Tabla UitilizacionInsumos

  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const utilizacionInsumosModificada = this.encuestaSeleccionada?.utilizacionInsumos;
      if (callback) callback();

  if (!idEmpresa || !utilizacionInsumosModificada || utilizacionInsumosModificada.length === 0) {
    console.error("No hay datos de Utilización de Insumos para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateUtilizacionInsumosMasiva`;

  this.http.put(url, utilizacionInsumosModificada).subscribe({
    next: () => console.log('Utilización de Insumos actualizada correctamente'),
    error: (error) => console.error('Error al actualizar Utilización de Insumos', error)
  });
}


guardarUtilizacionServicios(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const utilizacionServicios = this.encuestaSeleccionada?.utilizacionServicios;
      if (callback) callback();

  if (!idEmpresa || !utilizacionServicios || utilizacionServicios.length === 0) {
    console.error("No hay datos de Utilización de Servicios para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateUtilizacionServiciosMasiva`;

  this.http.put(url, utilizacionServicios).subscribe({
    next: () => console.log('Utilización de Servicios actualizada correctamente'),
    error: (error) => console.error('Error al actualizar Utilización de Servicios', error)
  });
}

guardarCantidadTrabajadores(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.cantidadTrabajadores;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de trabajadores.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateCantidadTrabajadoresMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Cantidad de trabajadores actualizada correctamente'),
    error: (err) => console.error('Error al actualizar trabajadores', err)
  });
}

guardarHorasNormales(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.horasNormales;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de horas normales.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateHorasNormalesMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Horas normales actualizadas correctamente'),
    error: (err) => console.error('Error al actualizar horas normales', err)
  });
}

guardarHorasExtras(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.horasExtras;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de horas extras.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateHorasExtrasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Horas extras actualizadas correctamente'),
    error: (err) => console.error('Error al actualizar horas extras', err)
  });
}

guardarVentas(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.venta;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de ventas.");
    return;
  }

  const url = `http://localhost:8080/apiThree/${idEmpresa}/updateVentasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Ventas actualizadas correctamente'),
    error: (err) => console.error('Error al actualizar ventas', err)
  });
}

guardarPerspectiva(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.perspectiva?.item;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de perspectiva para guardar.");
    return;
  }

  const url = `http://localhost:8080/apiFour/${idEmpresa}/updatePerspectivasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Perspectiva actualizada correctamente'),
    error: (err) => console.error('Error al actualizar perspectiva', err)
  });
}



  verEncuesta(idEncuesta: number) {
    this.http.get(`http://localhost:8080/api/${idEncuesta}`).subscribe((data: any) => {
      this.encuestaSeleccionada = data.encuesta;
      console.log('Encuesta seleccionada:', this.encuestaSeleccionada);
      this.mostrarModal = true;
    });
  }

    abrirModal(item: any) {
      this.itemSeleccionado = item;
      this.verEncuesta(item.idOperativo);
      this.mostrarModal = true;
    }
    
    
    cerrarModal() {
      this.mostrarModal = false;
      this.encuestaSeleccionada = {};
    }



    siguientePaso() {
      if (this.pasoActual < 15) this.pasoActual++;
    }
    
    pasoAnterior() {
      if (this.pasoActual > 1) this.pasoActual--;
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
