import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Swal.fire('Campos requeridos', 'Completa todos los campos.', 'warning');
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response: any) => {
        // Guardar user en localStorage
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('username', username); // Línea añadida

        Swal.fire('¡Bienvenido!', 'Sesión iniciada correctamente.', 'success').then(() => {
          // Redirigir según rol
          const role = response.roles[0];
          switch (role) {
            case 'ADMIN':
              this.router.navigate(['/homeAdm']);
              break;
            case 'SUPERVISOR':
              this.router.navigate(['/homeSup']);
              break;
            case 'VALIDADOR':
              this.router.navigate(['/homeVal']);
              break;
            case 'INGRESADOR':
              this.router.navigate(['/homeIng']);
              break;
            case 'ANALISTA':
              this.router.navigate(['/homeAn']);
              break;
            case 'COORDINADOR':
              this.router.navigate(['/homeCor']);
              break;
            default:
              // this.router.navigate(['/home']);
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'Usuario o contraseña incorrectos.', 'error');
      }
    });
  }
}
