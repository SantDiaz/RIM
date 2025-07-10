import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/sesion/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-adm',
  templateUrl: './home-adm.component.html',
  styleUrls: ['./home-adm.component.css']
})
export class HomeAdmComponent implements OnInit {
  users: any[] = [];
  availableRoles: string[] = ['ADMIN', 'SUPERVISOR', 'VALIDADOR', 'INGRESADOR', 'ANALISTA', 'COORDINADOR'];
  activeSegment: string = 'all'; // Variable para controlar el segmento activo
  usuarios: any[] = []; // Lista de usuarios cargados desde el backend
  selectedSegment: 'all' | 'favorites' = 'all'; // Inicialmente en 'all'




  constructor(private AuthService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.AuthService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  confirmRoleChange(userId: number, newRole: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres asignar el rol "${newRole}" a este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF8300',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar rol',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.changeUserRole(userId, newRole);
      }
    });
  }

  changeUserRole(userId: number, newRole: string) {
    this.AuthService.assignRole(userId, newRole).subscribe(
      () => {
        Swal.fire('Rol cambiado', 'El rol del usuario ha sido actualizado.', 'success');
        this.loadUsers(); // Recargar la lista de usuarios
      },
      (error) => {
        Swal.fire('Error', 'No se pudo cambiar el rol del usuario.', 'error');
      }
    );
  }



  onRoleChange(newRole: string, user: any) {
    if (newRole) {
      this.confirmRoleChange(user.id, newRole);
      user.roles[0] = newRole; // Actualiza el rol en la UI
    }
  }
  
    // Método para cambiar de segmento
    toggleSegment(segment: string) {
      this.activeSegment = segment;
    }

eliminarUsuario(username: string) {
  Swal.fire({
    title: `¿Eliminar a ${username}?`,
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.http.delete(`http://localhost:8080/api/usuarios/${username}`)
        .subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El usuario fue eliminado', 'success');
            this.users = this.users.filter(u => u.username !== username);
          },
          error: err => {
            console.error('Error al eliminar:', err);
            const errorMsg = err.error?.message || err.error || 'Error desconocido';
            Swal.fire('Error', 'No se pudo eliminar: ' + errorMsg, 'error');
          }
        });
    }
  });
}

}
