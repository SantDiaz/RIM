import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encuestas, encuestasObtener, InsumosBasicos } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';
import Swal from 'sweetalert2';
import { frasesLocales } from '../frasesLocales';

import { saveAs } from 'file-saver';
import { ViewChild, ElementRef } from '@angular/core';
// import { frasesLocales } from '../frasesMotivacionales'
@Component({
  selector: 'app-home-ing',
  templateUrl: './home-ing.component.html',
  styleUrls: ['./home-ing.component.css']
})
export class HomeIngComponent implements OnInit {

   pasoActual: number = 1;

    mostrarModal = false;
    itemSeleccionado: any = null;
    pendientes: encuestasObtener[] = [];
    encuestaSeleccionada: any = {};
    username: string = '';


      tipos = [
    "4.9. Energía eléctrica consumida (kw/h)",
    "4.10. GasOil consumido (litros)",
    "4.11. Gas consumido (m3)",
    "4.12. Agua consumida (Litros/m3)"
];
unidades: string[] = [
  'METRO (m)',
  'METRO CUADRADO (m2)',
  'METRO CÚBICO (m3)',
  'CENTÍMETRO (cm)',
  'CENTÍMETRO CUADRADO (cm2)',
  'CENTÍMETRO CÚBICO (cm3)',
  'KILOGRAMOS (kg)',
  'ONZA (oz)',
  'TONELADA (tn)',
  'QUINTAL (q)',
  'LITROS (lts)',
  'HECTOLITROS (hlts)',
  'UNIDADES (u)',
  'DOCENA (d)',
  'DECENA (dc)',
  'PACKS (pk)',
  'PARES (pr)',
  'OTRA UNIDAD'
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
    mod_usu: "e",
    fecha_mod_estado: new Date(),
  };

  idEmpresa: number = 0 ;
  activeSegment: string = 'all'; // Variable para controlar el segmento activo



  //IMAGEN DE PERFIL
avatarUrl: string | null = null;
defaultAvatarUrl = 'https://api.dicebear.com/7.x/initials/svg?seed=TuUsuario';
randomSeed2: string = this.generarSeedAleatorio();
fraseMotivacional: string = '';
autorFrase: string = '';
randomSeed: string = '';
intervalId: any;


  // frasesLocales = frasesLocales; // importar las frases


  constructor(private encuestaService: EncuestaService, private router: Router,private http: HttpClient ) { }

  ngOnInit(): void {
      window.addEventListener('keydown', this.manejarTeclado.bind(this));
     this.username = localStorage.getItem('username') || '';
        this.randomSeed = this.generarSeedAleatorio();
    this.obtenerFraseAleatoria(); // Muestra una al iniciar

    // Cambia frase y avatar cada 10 segundos
    this.intervalId = setInterval(() => {
      this.cambiarAvatarRandom();
    }, 20000);
  } 

  ngOnDestroy(): void {
  clearInterval(this.intervalId); // Limpia el intervalo al destruir el componente
  window.removeEventListener('keydown', this.manejarTeclado.bind(this));
}


manejarTeclado(event: KeyboardEvent): void {
  if (event.key === 'ArrowRight') {
    this.siguientePaso();
  } else if (event.key === 'ArrowLeft') {
    this.pasoAnterior();
  }
}


  estados = [
    'Ingresado',
    'Recepcionado',
    'Pre-validado',
    'Validado',

  ];

  
  estados2 = [
    'Validado',
    'Ingresado'
  ];


  cargarPendientes() {
    const estadosParam = this.estados2.map(estado => `estado=${encodeURIComponent(estado)}`).join('&');
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
      console.log('Encuesta seleccionada:', this.encuestaSeleccionada);
      this.mostrarModal = true;
    });
  }


siguientePaso() {
  if (this.pasoActual < 16) {
    this.pasoActual++;
    
    if (this.pasoActual === 16) {
      Swal.fire({
        title: 'Encuesta enviada',
        text: 'Gracias por completar la encuesta.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
          this.pasoActual = 1;   // Reinicia el stepper al paso 1
        this.cerrarModal(); // Cierra el modal después de aceptar el Swal
      });
    }
  } else {
    // Si ya está en el paso 15 y vuelve a presionar siguiente, se cierra directamente
    this.cerrarModal();
  }
}

  pasoAnterior() {
    if (this.pasoActual > 1) this.pasoActual--;
  }

guardarCambios() {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const index = this.pendientes.findIndex(p => p.idEmpresa === idEmpresa);
  this.encuestaSeleccionada.mod_usu = this.username;

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

  const mostrarMensajeError = (err: any) => {
    console.error(err);
    Swal.fire('Error', 'Ocurrió un error al guardar los cambios. Intente nuevamente.', 'error');
  };

  switch (this.pasoActual) {
    case 1:
      const url = `http://localhost:8080/api/${idEmpresa}/updateEncuestaIngresador`;
      this.http.put(url, this.encuestaSeleccionada).subscribe({
        next: () => mostrarMensajeExito(),
        error: err => mostrarMensajeError(err)
      });
      break;

    case 2:
      this.http.put(`http://localhost:8080/api/${idEmpresa}/updateDatosIdentificacionEmpresa`, this.encuestaSeleccionada.datosIdentificacionEmpresa)
        .subscribe({
          next: () => mostrarMensajeExito(),
          error: err => mostrarMensajeError(err)
        });
      break;

    case 3:
      this.http.put(`http://localhost:8080/api/${idEmpresa}/updateDatosRespondiente`, this.encuestaSeleccionada.datosRespondiente)
        .subscribe({
          next: () => mostrarMensajeExito(),
          error: err => mostrarMensajeError(err)
        });
      break;

        case 4:
          const referente = this.encuestaSeleccionada?.datosReferente;

          if (!referente) {
            console.error("No hay datos del referente");
            return;
          }

          // Mapear propiedades al formato esperado por el backend
          const datosReferente = {
            nombreApellido: referente.nombreApellido,
            cargoArea: referente.cargoArea,
            tipoTelefono: referente.tipoTelefono,
            numeroTelefono: referente.numeroTelefono,
            email: referente.email // si tienes el email cargado
          };

          this.http.put(`http://localhost:8080/api/${idEmpresa}/updateDatosReferente`, datosReferente)
            .subscribe({
              next: () => mostrarMensajeExito(),
              error: err => mostrarMensajeError(err)
            });
          break;


    case 5:
      this.guardarProduccion(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 6:
      this.guardarInsumosBasicos(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 7:
      this.guardarManoDeObra(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 8:
      this.guardarUtilizacionInsumos(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 9:
      this.guardarUtilizacionServicios(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 10:
      this.guardarCantidadTrabajadores(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 11:
      this.guardarHorasNormales(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 12:
      this.guardarHorasExtras(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 13:
      this.guardarVentas(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 14:
      this.guardarInvestigaciones(mostrarMensajeExito, mostrarMensajeError);
      break;
    case 15:
      this.guardarPerspectiva(mostrarMensajeExito, mostrarMensajeError);
      break;

    default:
      console.log('Paso no manejado aún');
      break;
  }
}



guardarProduccion(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const produccionModificada = this.encuestaSeleccionada?.produccion;

  if (!idEmpresa || !produccionModificada || produccionModificada.length === 0) {
    console.error("No hay datos de producción para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateProduccionMasiva`;

  this.http.put(url, produccionModificada).subscribe({
    next: () => {
      console.log('Producción actualizada correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (error) => {
      console.error('Error al actualizar producción', error);
      if (callbackError) callbackError(error);
    }
  });
}

guardarInsumosBasicos(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.insumosBasicos;

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos para guardar Insumos Básicos.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateInsumosMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Insumos Básicos actualizados correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (error) => {
      console.error('Error al actualizar Insumos Básicos', error);
      if (callbackError) callbackError(error);
    }
  });
}

guardarManoDeObra(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const manoDeObraModificada = this.encuestaSeleccionada?.manoDeObra;

  if (!idEmpresa || !manoDeObraModificada || manoDeObraModificada.length === 0) {
    console.error("No hay datos de Mano de Obra para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateManoDeObraMasiva`;

  this.http.put(url, manoDeObraModificada).subscribe({
    next: () => {
      console.log('Mano de Obra actualizada correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (error) => {
      console.error('Error al actualizar Mano de Obra', error);
      if (callbackError) callbackError(error);
    }
  });
}




guardarUtilizacionInsumos(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const utilizacionInsumosModificada = this.encuestaSeleccionada?.utilizacionInsumos;

  if (!idEmpresa || !utilizacionInsumosModificada || utilizacionInsumosModificada.length === 0) {
    console.error("No hay datos de Utilización de Insumos para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateUtilizacionInsumosMasiva`;

  this.http.put(url, utilizacionInsumosModificada).subscribe({
    next: () => {
      console.log('Utilización de Insumos actualizada correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (error) => {
      console.error('Error al actualizar Utilización de Insumos', error);
      if (callbackError) callbackError(error);
    }
  });
}


guardarUtilizacionServicios(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const utilizacionServicios = this.encuestaSeleccionada?.utilizacionServicios;

  if (!idEmpresa || !utilizacionServicios || utilizacionServicios.length === 0) {
    console.error("No hay datos de Utilización de Servicios para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateUtilizacionServiciosMasiva`;

  this.http.put(url, utilizacionServicios).subscribe({
    next: () => {
      console.log('Utilización de Servicios actualizada correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (error) => {
      console.error('Error al actualizar Utilización de Servicios', error);
      if (callbackError) callbackError(error);
    }
  });
}


guardarCantidadTrabajadores(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.cantidadTrabajadores;

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de trabajadores.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateCantidadTrabajadoresMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Cantidad de trabajadores actualizada correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (err) => {
      console.error('Error al actualizar trabajadores', err);
      if (callbackError) callbackError(err);
    }
  });
}


guardarHorasNormales(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.horasNormales;

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de horas normales.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateHorasNormalesMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Horas normales actualizadas correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (err) => {
      console.error('Error al actualizar horas normales', err);
      if (callbackError) callbackError(err);
    }
  });
}

guardarHorasExtras(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.horasExtras;

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de horas extras.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateHorasExtrasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Horas extras actualizadas correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (err) => {
      console.error('Error al actualizar horas extras', err);
      if (callbackError) callbackError(err);
    }
  });
}


guardarVentas(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.venta;

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de ventas.");
    return;
  }

  const url = `http://localhost:8080/apiThree/${idEmpresa}/updateVentasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Ventas actualizadas correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (err) => {
      console.error('Error al actualizar ventas', err);
      if (callbackError) callbackError(err);
    }
  });
}
guardarInvestigaciones(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const investigacion = this.encuestaSeleccionada?.investigacionDesarrollo;
  const actividades = investigacion?.actividad;

  if (!idEmpresa || !actividades || actividades.length === 0) {
    console.error("No hay datos de investigación y desarrollo.");
    return;
  }

  // Convertimos realiza a "Sí" / "No" en cada actividad
  const actividadesConvertidas = actividades.map((act: any) => ({
    ...act,
    realiza: act.realiza === true || act.realiza === "Sí" ? "Sí" : "No"
  }));

  // Armamos el objeto igual al de Postman
  const datos = [
    {
      id: investigacion?.id || null, // Si no tenés ID lo mandamos como null
      actividad: actividadesConvertidas
    }
  ];

  const url = `http://localhost:8080/apiFour/${idEmpresa}/updateInvestigacionesMasiva`;

  console.log('URL:', url);
  console.log('Datos enviados:', JSON.stringify(datos, null, 2));

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Investigaciones actualizadas correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (err) => {
      console.error('Error al actualizar investigaciones', err);
      if (callbackError) callbackError(err);
    }
  });
}




guardarPerspectiva(callbackSuccess?: () => void, callbackError?: (err: any) => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const perspectiva = this.encuestaSeleccionada?.perspectiva;

  if (!idEmpresa || !perspectiva || !perspectiva.item || perspectiva.item.length === 0) {
    console.error("No hay datos de perspectiva para guardar.");
    return;
  }

  const url = `http://localhost:8080/apiFour/${idEmpresa}/updatePerspectivasMasiva`;

  // El backend espera un array con id y el array item
  const datos = [
    {
      id: perspectiva.id, // asegúrate de que tengas el id
      item: perspectiva.item
    }
  ];

  this.http.put(url, datos).subscribe({
    next: () => {
      console.log('Perspectiva actualizada correctamente');
      if (callbackSuccess) callbackSuccess();
    },
    error: (err) => {
      console.error('Error al actualizar perspectiva', err);
      if (callbackError) callbackError(err);
    }
  });
}


    
  abrirModal(item: any) {
    this.itemSeleccionado = item;
    this.mostrarModal = true;
  }
  
  
  cerrarModal() {
    this.mostrarModal = false;
    this.encuestaSeleccionada = {};
  }

  
agregarItemProduccion() {
  if (!this.encuestaSeleccionada.produccion) {
    this.encuestaSeleccionada.produccion = [];
  }

  this.encuestaSeleccionada.produccion.push({
    producto: '',
    unidad_medida: '',
    mercado_interno: null,
    mercado_externo: null,
    observaciones: ''
  });
}

agregarUtilizacionInsumos(){
  if (!this.encuestaSeleccionada.utilizacionInsumos) {
    this.encuestaSeleccionada.utilizacionInsumos = [];
  }

  this.encuestaSeleccionada.utilizacionInsumos.push({
    producto: '',
    unidad_medida: '',
    cantidad: 0,
    monto_pesos: 0,
    });
}

agregarUtilizacionServicios(){
  if (!this.encuestaSeleccionada.utilizacionServicios) {
    this.encuestaSeleccionada.utilizacionServicios = [];
  }

  this.encuestaSeleccionada.utilizacionServicios.push({
    nombre: '',
    monto_pesos: 0,
    });
}


agregarItemInsumoBasico(){
  if (!this.encuestaSeleccionada.insumosBasicos) {
    this.encuestaSeleccionada.insumosBasicos = [];
  }

  this.encuestaSeleccionada.insumosBasicos.push({
    tipo: '',
    cantidad: 0,
    monto_pesos: 0,
  });
}


agregarItemManoDeObra(){
  if (!this.encuestaSeleccionada.manoDeObra) {
    this.encuestaSeleccionada.manoDeObra = [];
  }

  this.encuestaSeleccionada.manoDeObra.push({
    tipo: '',
    monto_pesos: 0,
    });
}


eliminarUltimoItemProduccion() {
  if (this.encuestaSeleccionada?.produccion?.length > 0) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar el último producto de Producción?');
    if (confirmacion) {
      this.encuestaSeleccionada.produccion.pop();
    }
  }
}

eliminarUltimoItemUtilizacionInsumos() {
  if (this.encuestaSeleccionada?.utilizacionInsumos?.length > 0) {
    const confirmacion = confirm('¿Eliminar el último insumo utilizado?');
    if (confirmacion) {
      this.encuestaSeleccionada.utilizacionInsumos.pop();
    }
  }
}

eliminarUltimoItemUtilizacionServicios() {
  if (this.encuestaSeleccionada?.utilizacionServicios?.length > 0) {
    const confirmacion = confirm('¿Eliminar el último servicio utilizado?');
    if (confirmacion) {
      this.encuestaSeleccionada.utilizacionServicios.pop();
    }
  }
}

eliminarUltimoItemInsumoBasico() {
  if (this.encuestaSeleccionada?.insumosBasicos?.length > 0) {
    const confirmacion = confirm('¿Eliminar el último insumo básico?');
    if (confirmacion) {
      this.encuestaSeleccionada.insumosBasicos.pop();
    }
  }
}

eliminarUltimoItemManoDeObra() {
  if (this.encuestaSeleccionada?.manoDeObra?.length > 0) {
    const confirmacion = confirm('¿Eliminar el último registro de Mano de Obra?');
    if (confirmacion) {
      this.encuestaSeleccionada.manoDeObra.pop();
    }
  }
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

      // Método para cambiar de segmento
      toggleSegment(segment: string) {
        this.activeSegment = segment;
      
        if (segment === 'favorites') {
          this.cargarPendientes();
        }
      }






  //IMAGEN DE PERFIL 

onAvatarSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      this.avatarUrl = base64Image;
      localStorage.setItem('avatarImage', base64Image); // Guarda en localStorage
    };
    reader.readAsDataURL(file);
  }
}



  // obtenerFraseAleatoria(): void {
  //   const random = Math.floor(Math.random() * this.frasesLocales.length);
  //   const frase = this.frasesLocales[random];
  //   this.fraseMotivacional = frase.frase;
  //   this.autorFrase = frase.autor;
  // }


  cambiarAvatarRandom() {
    this.randomSeed = this.generarSeedAleatorio();
    this.obtenerFraseAleatoria();
  }

  generarSeedAleatorio(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  obtenerFraseAleatoria(): void {
    const random = Math.floor(Math.random() * frasesLocales.length);
    const frase = frasesLocales[random];
    this.fraseMotivacional = frase.frase;
    this.autorFrase = frase.autor;
  }
}
