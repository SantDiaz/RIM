import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encuestas } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';

@Component({
  selector: 'app-home-ing',
  templateUrl: './home-ing.component.html',
  styleUrls: ['./home-ing.component.css']
})
export class HomeIngComponent implements OnInit {

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
  activeSegment: string = 'all'; // Variable para controlar el segmento activo

  
  constructor(private encuestaService: EncuestaService, private router: Router ) { }

  ngOnInit(): void {
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
  }
}
