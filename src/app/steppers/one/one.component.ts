import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { bienes, datos_empresas, domicilio_industrial, email_respondente, nombres_fantasia, opciones_servicios, produccion, productos, respondente, servicios, telefonos_empresa, telefonos_repondente, unidad_medidas } from 'src/app/Interfaces/models';
import {  produccion, unidad_medidas, servicios_basicos, remuneraciones_cargas, DatosEmpresa, DatosRespondiente, UtilizacionInsumos, UtilizacionServicio, InsumosBasicos, manoDeObra, tipo, Datos_referente  } from 'src/app/Interfaces/models';
import { ServicesService } from 'src/app/services/services.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of, forkJoin, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.css']
})
export class OneComponent implements OnInit {
  currentStep = 1;
  unidad_medida = unidad_medidas;
  tipos = [
    "4.9. Energía eléctrica consumida (kw/h)",
    "4.10. GasOil consumido (litros)",
    "4.11. Gas consumido (m3)",
    "4.12. Agua consumida (Litros/m3)"
];
  // empresas: datos_empresas[] = [];
  // selectedEmpresa: datos_empresas | null = null;
  
  private searchTermSubject = new Subject<string>();
  
  
  producciones: produccion[] = [];
//   produccionEjemplo: produccion = {
//     id: 0,
//     producto: '',
//     unidad_medida: 'CENTÍMETRO (cm)', // Puedes dejarlo como null inicialmente
//     mercado_interno: 0, // Inicialmente null
//     mercado_externo: 0, // Inicialmente null
//     id_empresa: undefined, // Opcional, se puede dejar como undefined
//     observaciones: '' // Inicialmente vacío
// };
// bieness: InsumosBasicos[] = [];
    bieness:  UtilizacionInsumos  [] = [];
    insumo_basic: InsumosBasicos[] = [];
    servicioss: UtilizacionServicio[] = [];
    remuneraciones_cargas : manoDeObra[] = [];
    servicio_basico = servicios_basicos;
    remuneracion_carga = remuneraciones_cargas;


//Recibir id_empresa de tabla encuestas
idEmpresa: number = 0 ;



  datosEmpresa: DatosEmpresa = {
    id : 0,
    nombreEmpresa: '',
    nombreFantasia: '',
    cuit: '',
    direccionEstablecimiento: '',
    direccionAdministracion: '',
    localidadEstablecimiento: '',
    actividadPrincipal: '',
    clanae: '',

  };

  datosRespondiente: DatosRespondiente = {
    id: 0,
    nombreApellido: '',
    cargoArea: '',
    tipoTelefono: 'Particular',
    numeroTelefono: '',
    email: ''
  };

    datosRefente: Datos_referente = {
    id: 0,
    cargoArea: '',
    nombre_apellido: '',
    tipo_telefono: 'Particular',
    numero_telefono: '',
    id_empresa: 0
  };
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private oneService: ServicesService,
    private http: HttpClient,
  ) { }


  
  ngOnInit(): void {
    this.agregarNuevaFila(); // Agregar una fila inicial
    this.agregarNuevaFila3(); // Agregar una fila inicial
    this.agregarNuevaFilaServicio();
    this.agregarNuevaFilaServicioBasico();
    this.agregarNuevaFilaRemuneracionCarga();
    this.idEmpresa = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID Empresa recibido:', this.idEmpresa);
  }

  onSearchChange(term: string) {
    this.searchTermSubject.next(term);
  }

 
  actualizarProduccion(index: number, nombre: string) {
    this.producciones[index].producto = nombre;
  }



  // AGREGAR FILAS

  agregarNuevaFila() {
    const nuevaProduccion: produccion = {
      id: 0,
      producto: '',
      unidad_medida: 'CENTÍMETRO (cm)',
      mercado_interno: 0,
      mercado_externo: 0
    };
    this.producciones.push(nuevaProduccion);
  }

  
  agregarNuevaFila3() {
    const nuevaBienes:  UtilizacionInsumos = {
      id: 0,
    producto: '',
    unidad_medida: 'CENTÍMETRO CUADRADO (cm2)',
    cantidad: 0,
    monto_pesos: 0,

    };
    this.bieness.push(nuevaBienes);
}

  agregarNuevaFilaServicio() {
    this.servicioss.push({ id: 0,  nombre: '', monto_pesos: 0 });
  }

  agregarNuevaFilaServicioBasico(){
    const nuevaServicioBasico: InsumosBasicos = {

    id: 0,
    tipo: '4.9. Energía eléctrica consumida (kw/h)',
    cantidad: 0,
    monto_pesos: 0,
    };
    this.insumo_basic.push(nuevaServicioBasico);
  }

  agregarNuevaFilaRemuneracionCarga(){
    const nuevaRemuneracionCarga: manoDeObra = {
      id: 0,
      tipo: '4.13. Sueldos y Jornales Brutas totales, incluido SAC y horas extras',
      monto_pesos: 0,
    };
    this.remuneraciones_cargas.push(nuevaRemuneracionCarga);
  }


  //ELIMINAR FILAS

  eliminarUltimaFilaProduccion() {
    if (this.producciones.length > 0) {
      this.producciones.pop();
    }
  }
  
  eliminarUltimaFilaServicios() {
    if (this.servicioss.length > 0)  {
      this.servicioss.pop();

    }
  }
  
  eliminarUltimaFilaBienes() {
    if (this.bieness.length > 0) {
      this.bieness.pop();
    }
  }


  eliminarUltimaFilaServicioBasico(){
    if (this.insumo_basic.length > 0) {
      this.insumo_basic.pop();
    }
  }
  

  eliminarUltimaFilaRemuneracionCarga(){
    if (this.remuneraciones_cargas.length > 0) {
      this.remuneraciones_cargas.pop();
    }
  }
  

        // this.router.navigate(['/one', idEmpresa]);


    EnviarS1() {      
      console.log(this.datosEmpresa); // Verificar datos enviados
    
      // Agrega el idEmpresa a los datos que vas a enviar
      this.datosEmpresa.id_empresa = this.idEmpresa;
      this.datosRespondiente.id_empresa = this.idEmpresa;
    
      // Enviar datos de la empresa
      this.oneService.enviarDatosEmpresa(this.datosEmpresa).subscribe({
        next: (response) => {
          console.log('Datos enviados exitosamente:', response);
          if (this.currentStep < 10) {
            this.currentStep++;
            this.updateStepVisibility();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }    
        },
        complete: () => {
          console.log('Solicitud completada.');
        }
      });
    
      // Enviar datos del respondiente
      this.oneService.enviarDatosRespondiente(this.datosRespondiente).subscribe(
        (response) => {
          console.log('Datos del respondiente enviados exitosamente:', response);
        },
        (error) => {
          console.error('Error al enviar los datos del respondiente:', error);
        }
      );
    }
 

 step2() {
  console.log(this.producciones);

  // Asignar id_empresa a cada producción
  this.producciones.forEach(produccion => produccion.id_empresa = this.idEmpresa);

  // Crear array de observables
  const requests = this.producciones.map(produccion => 
    this.oneService.enviarDatosProduccion(produccion)
  );

  // Usar forkJoin para esperar a que todas terminen
  forkJoin(requests).subscribe({
    next: responses => {
      console.log('Todos los datos enviados exitosamente:', responses);

      // Avanzar paso sólo una vez cuando terminen todas las llamadas
      if (this.currentStep < 10) {
        this.currentStep++;
        this.updateStepVisibility();
        this.router.navigate(['/two', this.idEmpresa]);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    error: err => {
      console.error('Error al enviar los datos:', err);
      // Aquí podés mostrar mensaje de error
    }
  });
}

    step3() {
      // Validación de datos
      // if (!this.validateData()) {
      //   console.error('Validación fallida. Por favor, revise todos los campos.');
      //   return;
      // }
    
      // Asigna id_empresa a cada fila de las tablas antes de enviar
      this.bieness.forEach(insumo => insumo.id_empresa = this.idEmpresa);
      this.servicioss.forEach(servicio => servicio.id_empresa = this.idEmpresa);
      this.insumo_basic.forEach(insumoBasico => insumoBasico.id_empresa = this.idEmpresa);
      this.remuneraciones_cargas.forEach(manoObra => manoObra.id_empresa = this.idEmpresa);
      console.log('Datos a enviar step3:', this.bieness, this.servicioss, this.insumo_basic, this.remuneraciones_cargas);

      // Crea un arreglo de observables para cada tipo de dato que se va a enviar
      const bienesRequests = this.bieness.map(insumo => 
        this.oneService.enviarDatosServiciosBasicos(this.idEmpresa, insumo  ).pipe(
          tap(() => console.log(`Insumo enviado exitosamente: ${insumo.producto}`)),
        )
      );
    
      const insumosBasicosRequests = this.insumo_basic.map(insumoBasico => 
        this.oneService.enviarDatosBienes(this.idEmpresa,insumoBasico ).pipe(
          tap(() => console.log(`Insumo básico enviado exitosamente: ${insumoBasico.tipo}`)),

        )
      );
      const serviciosRequests = this.servicioss.map(servicio => 
        this.oneService.enviarDatosServicios(this.idEmpresa, servicio).pipe(
          tap(() => console.log(`Servicio enviado exitosamente: ${servicio.nombre}`)),

        )
      );
    
    
      const manoObraRequests = this.remuneraciones_cargas.map(manoObra => 
        this.oneService.enviarManoDeObra(this.idEmpresa, manoObra).pipe(
          tap(() => console.log(`Mano de obra enviada exitosamente: ${manoObra.tipo}`)),
          
        )
      );
      
      // Combina todas las solicitudes en un solo observable
      const allRequests = forkJoin([
        ...bienesRequests,
        ...serviciosRequests,
        ...insumosBasicosRequests,
        ...manoObraRequests
      ]);
    
      allRequests.subscribe({
        next: responses => {
          const successfulResponses = responses.filter(response => response !== null);
          console.log(`Respuestas exitosas: ${successfulResponses.length}/${responses.length}`);
          
          if (successfulResponses.length === responses.length) {
            console.log('Todos los datos fueron enviados correctamente');
          } else {
            console.warn('Algunos datos no se enviaron correctamente');
            this.router.navigate(['/two', this.idEmpresa]);
            // Aquí podrías mostrar un mensaje al usuario o intentar reenviar los datos fallidos
          }
        },
        error: error => {
          console.error('Error en la ejecución de las solicitudes:', error);
          this.router.navigate(['/two', this.idEmpresa]);

          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
    
    // // Método de validación
    // private validateData(): boolean {
    //   let isValid = true;
    
    //   // Validar bienes
    //   this.bieness.forEach((bien, index) => {
    //     if (!bien.producto || !bien.unidad_medida || !bien.cantidad || !bien.monto_pesos) {
    //       console.error(`Bien en índice ${index} tiene campos incompletos`);
    //       isValid = false;
    //     }
    //   });
    
    //   // Validar servicios
    //   this.servicioss.forEach((servicio, index) => {
    //     if (!servicio.nombre || !servicio.monto_pesos) {
    //       console.error(`Servicio en índice ${index} tiene campos incompletos`);
    //       isValid = false;
    //     }
    //   });
    
    //   // Validar servicios básicos
    //   this.servicio_basic.forEach((servicioB, index) => {
    //     if (!servicioB.tipo || !servicioB.cantidad || !servicioB.monto_pesos) {
    //       console.error(`Servicio básico en índice ${index} tiene campos incompletos`);
    //       isValid = false;
    //     }
    //   });
    
    //   // Validar mano de obra
    //   this.remuneraciones_cargas.forEach((remuCarga, index) => {
    //     if (!remuCarga.tipo || !remuCarga.monto_pesos) {
    //       console.error(`Remuneración/carga en índice ${index} tiene campos incompletos`);
    //       isValid = false;
    //     }
    //   });
    
    //   return isValid;
    
  nextStep() {
    if (this.currentStep < 10) {
      this.currentStep++;
      this.updateStepVisibility();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepVisibility();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // nextStepper() {
  //   this.router.navigate(['/two']);
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  updateStepVisibility() {
    for (let i = 1; i <= 10; i++) {
      const step = document.getElementById(`step-${i}`);
      if (step) {
        if (i === this.currentStep) {
          step.classList.remove('hidden');
        } else {
          step.classList.add('hidden');
        }
      }
    }
  }
}
