import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { investigacionDesarrollo, perspectiva } from 'src/app/Interfaces/models';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-four',
  templateUrl: './four.component.html',
  styleUrls: ['./four.component.css']
})
export class FourComponent implements OnInit {
  idEmpresa: number = 0;

  invest: investigacionDesarrollo = {
    id: 0,
    id_empresa: 0,
    actividad: [], //siempre fue actividad l
  };

  perspect: perspectiva = {
    id: 0,
    id_empresa: 0,
    item: [],
  };

  currentStep = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fourServices: ServicesService,
  ) { }

  ngOnInit(): void {
    this.idEmpresa = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeItems();
    this.initializePerspectiva();
  }

  initializeItems() {
    // Inicializar items de investigación con id_empresa
    this.invest.actividad = [
      { nombre: 'a. 1 Provincial', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'a. 2 Otra Provincia', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'a. 3 Internacional', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'b. I+D interna', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'c. Adquisición de maquinarias y equipos', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'd. Adquisición de Hardware', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'e. Contratación de Tecnología', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'f. Capacitación', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'g. Diseño industrial y actividades de ingeniería', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      { nombre: 'h. Consultorías', monto: 0, id_empresa: this.idEmpresa, realiza: '' },
      // Agrega otros items aquí
    ];
  }

  initializePerspectiva() {
    // Inicializar items de perspectiva con id_empresa
    this.perspect.item = [
      { id_empresa: this.idEmpresa, nombre: '10.1 Demanda interna', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.2 Exportaciones totales', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.3 Exportaciones al Mercosur (exclusivamente)', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.4 Importaciones totales de insumos', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.5 Importaciones de insumos Mercosur (exclusivamente)', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.6 Stocks de productos terminados', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.7 Utilización de la capacidad instalada	', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.8 Necesidades de crédito', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.9 Personal ocupado', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.10 Inversión en bienes de capita', observaciones: '', respuesta: '' },
      { id_empresa: this.idEmpresa, nombre: '10.11 Expectativa de ventas', observaciones: '', respuesta: '' },
    ];
  }


  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepVisibility();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }


  updateStepVisibility() {
    for (let i = 1; i <= 10; i++) {  // Ajusta este número si añades más pasos
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

  step1() {
    // Envía los datos de investigación y desarrollo al backend
    console.log('Datos a enviar:', this.invest);  // Revisa si los datos de "actividad" están presentes
    this.invest.id_empresa = this.idEmpresa;

    this.fourServices.enviarInvestigacionDesarrollo(this.idEmpresa,this.invest).subscribe(
      response => {
        console.log('Datos de investigación enviados correctamente:', response);
        // Aquí puedes manejar la respuesta exitosa, como redirigir o mostrar un mensaje
      },
      error => {
        console.error('Error al enviar los datos de investigación:', error);
        if (this.currentStep < 10) {  // Ajusta este número si añades más pasos
          this.currentStep++;
          this.updateStepVisibility();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Aquí puedes manejar el error, como mostrar un mensaje de error
      }
    );
  }

  step2() {
    // Envía los datos de perspectiva al backend
    console.log('Datos de perspectiva a enviar:', this.perspect);  // Revisa si los datos de "item" están presentes
    this.perspect.id_empresa = this.idEmpresa;

    this.fourServices.enviarPerspectiva(this.idEmpresa, this.perspect).subscribe(
      response => {
        console.log('Datos de perspectiva enviados correctamente:', response);
        this.router.navigate(['/home']); // Redirige al siguiente paso
        // Aquí puedes manejar la respuesta exitosa, como redirigir o mostrar un mensaje
      },
      error => {
        console.error('Error al enviar los datos de perspectiva:', error);
        this.router.navigate(['/home']);
        // Aquí puedes manejar el error, como mostrar un mensaje de error
      }
    );
  }
}
