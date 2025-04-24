import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { OneComponent } from './steppers/one/one.component';
import { TwoComponent } from './steppers/two/two.component';
import { ThreeComponent } from './steppers/three/three.component';
import { FourComponent } from './steppers/four/four.component';
import { LoginComponent } from './sesion/login/login.component';
import { RegisterComponent } from './sesion/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './tables/table/table.component';
import { ConsultasComponent } from './tables/consultas/consultas.component';
import { HomeAnComponent } from './home/homeProfile/home-an/home-an.component';
import { HomeIngComponent } from './home/homeProfile/home-ing/home-ing.component';
import { HomeAdmComponent } from './home/homeProfile/home-adm/home-adm.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeCorComponent } from './home/homeProfile/home-cor/home-cor.component';
import { HomeSupComponent } from './home/homeProfile/home-sup/home-sup.component';
import { HomeValComponent } from './home/homeProfile/home-val/home-val.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    OneComponent,
    TwoComponent,
    ThreeComponent,
    FourComponent,
    LoginComponent,
    RegisterComponent,
    TableComponent,
    ConsultasComponent,
    HomeAnComponent,
    HomeIngComponent,
    HomeAdmComponent, 
    HomeCorComponent,
    HomeSupComponent,
    HomeValComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,  // Add HttpClientModule here
    ReactiveFormsModule,
  ],
  exports: [
    HomeComponent,
    HeaderComponent,
    OneComponent,
    TwoComponent,
    ThreeComponent,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
