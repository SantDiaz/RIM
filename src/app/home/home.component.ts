import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;

    if (!this.user) {
      console.warn('Usuario no autenticado');
      return;
    }

    const mainRole = this.getMainRole();

    // Redireccionar según el rol principal
    switch (mainRole) {
      case 'ADMIN':
        this.router.navigate(['/homeAdm']);
        break;
      case 'INGRESADOR':
        this.router.navigate(['/homeIng']);
        break;
      case 'ANALISTA':
        this.router.navigate(['/homeAn']);
        break;
      case 'SUPERVISOR':
        this.router.navigate(['/homeSup']);
        break;
      case 'COORDINADOR':
        this.router.navigate(['/homeCor']);
        break;
      default:
        console.warn('Rol no reconocido:', mainRole);
        this.router.navigate(['/no-autorizado']);
    }
  }

  getMainRole(): string | null {
    return this.user?.roles?.[0] || null;
  }
}
