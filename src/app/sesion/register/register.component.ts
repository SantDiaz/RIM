import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Profile, User } from 'src/app/Interfaces/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;
  profiles: Profile[] = [
    { id: 1, name: 'Supervisor' },
    { id: 2, name: 'Validador' },
    { id: 3, name: 'Ingresador' },
    { id: 4, name: 'Analista' },
    { id: 5, name: 'Coordinador' },
    { id: 6, name: 'Administrador' },
  ];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      profile: ['', Validators.required]  // Aquí se guarda el profileId
    });
  }

  ngOnInit(): void {
    // Si necesitas cargar perfiles desde un servicio, puedes hacerlo aquí
  }
// Método para enviar el formulario
onRegister(): void {
  if (this.registerForm.valid) {
    const { username, password, profile } = this.registerForm.value;

    const userData = {
      username,
      password,
      profileId: profile
    };

    this.authService.register(userData.username, userData.password).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: `El usuario "${userData.username}" fue registrado correctamente.`,
          confirmButtonColor: '#FF8300'
        }).then(() => {
          // Opcional: redirigir a login
          // this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Ocurrió un problema al registrar el usuario. Intenta de nuevo.',
          confirmButtonColor: '#FF8300'
        });
        console.error('Error al registrar usuario', error);
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor, completa todos los campos obligatorios.',
      confirmButtonColor: '#FF8300'
    });
  }
}


}
