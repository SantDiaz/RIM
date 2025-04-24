import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userData = localStorage.getItem('user');

    if (!userData) {
      // Usuario no autenticado
      this.router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userData);
    const expectedRoles: string[] = route.data['roles'];

    // Si no se especifican roles, cualquier usuario logueado puede acceder
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Si el usuario no tiene ninguno de los roles requeridos
    const hasRole = user.roles?.some((role: string) => expectedRoles.includes(role));
    if (!hasRole) {
      this.router.navigate(['/home']); // o /no-autorizado
      return false;
    }

    return true;
  }
}
