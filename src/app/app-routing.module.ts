import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OneComponent } from './steppers/one/one.component';
import { TwoComponent } from './steppers/two/two.component';
import { ThreeComponent } from './steppers/three/three.component';
import { FourComponent } from './steppers/four/four.component';
import { LoginComponent } from './sesion/login/login.component';
import { RegisterComponent } from './sesion/register/register.component';
import { TableComponent } from './tables/table/table.component';
import { HomeAdmComponent } from './home/homeProfile/home-adm/home-adm.component';
import { HomeAnComponent } from './home/homeProfile/home-an/home-an.component';
import { HomeIngComponent } from './home/homeProfile/home-ing/home-ing.component';
import { HomeSupComponent } from './home/homeProfile/home-sup/home-sup.component';
import { HomeCorComponent } from './home/homeProfile/home-cor/home-cor.component';
import { HomeValComponent } from './home/homeProfile/home-val/home-val.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'one/:id',
    component: OneComponent
  },
  {
    path: 'two/:id',
    component: TwoComponent
  },
  {
    path: 'three/:id',
    component: ThreeComponent
  },
  {
    path: 'four/:id',
    component: FourComponent
  },
  { 
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'table',
    component: TableComponent
  },
  {
    path: 'homeAdm',
    component: HomeAdmComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'homeAn',
    component: HomeAnComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ANALISTA'] }
  },
  {
    path: 'homeIng',
    component: HomeIngComponent,
    canActivate: [AuthGuard],
    data: { roles: ['INGRESADOR'] }

  },
  {
    path: 'homeSup',
    component: HomeSupComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERVISOR'] }
  },
  {
    path: 'homeCor',
    component: HomeCorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['COORDINADOR'] }
  },
  {
    path: 'homeVal',
    component: HomeValComponent,
    canActivate: [AuthGuard],
    data: { roles: ['VALIDADOR'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }