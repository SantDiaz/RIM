// CONSULTA1
// src/app/Interfaces/models.ts (modify your existing DatoControl interface)

export interface DatoControl {
  ID: number;
  supervisor: string;
  Referente: string;
  Estrato: string | null; // Keep this as string literal
  Razon: string; // Keep this as string literal
  CLANAE: string;
  Email_referente: string | null;
  Localidad: string;
  Dirección: string; // Keep this as string literal
  NombreInformante: string;
  Teléfono_referente: string | null;
  Forma_de_relevamiento: string;
  

}

// CONSULTA 2
export interface ResumenRim {
  categoria: string;
  cantidad: number;
  porcentaje: number | null; // Puede ser null en algunos casos
}
// CONSULTA 3
export interface Campo {
  categoria: string;
  cantidad: number | null; // Puede ser null en algunos casos
  porcentaje: number | null; // Puede ser null en algunos casos
}
// CONSULTA 4

export interface TasaNoRespuesta {
  tabla: string;
  cant_no_respuesta: number;
  cant_total: number;
  tasa_no_respuesta: number;
}
export interface encuestasObtener{

  idEmpresa: number;
  idOperativo: number;
  ingresador: string;
  analista: string;
  fecha_entrega : Date;
  fecha_recupero : Date;
  fecha_supervision : Date;
  fecha_ingreso : Date;
  medio: 'PAPEL' | 'DIGITAL'
  observaciones_ingresador: string;
  observaciones_analista: string;
  anio? : '2024';
  estado?: string;
  supervisor?: string;
  observaciones_supervisor?: string;
  referente?:string;
  fecha_mod_estado?: Date;
  mod_usu: string;
}


export interface encuestas {

    id_empresa: number;
    id_operativo: number;
    ingresador: string;
    analista: string;
    fecha_entrega : Date;
    fecha_recupero : Date;
    fecha_supervision : Date;
    fecha_ingreso : Date;
    medio: 'PAPEL' | 'DIGITAL'
    observaciones_ingresador: string;
    observaciones_analista: string;
    anio? : '2024';
    estado?: string;
    supervisor?: string;
    observaciones_supervisor?: string;
    referente?:string;
    fecha_mod_estado?: Date;
    mod_usu?: string;

}

export interface DatosEmpresa {
    id: number;
    nombreEmpresa: string;
    nombreFantasia: string;
    cuit: string;
    direccionEstablecimiento: string;
    direccionAdministracion: string;
    localidadEstablecimiento: string;
    actividadPrincipal: string;
    id_empresa?: number;  // Agregar id_empresa
    clanae?: string;
    estratificación?: string;
  }
  
  export interface DatosRespondiente {
    id: number; //hay que agregarselo para hacer las PK Y FK listo.
    nombreApellido: string;
    cargoArea: string;
    tipoTelefono: 'Particular' | 'Corporativo';
    numeroTelefono: string;
    email: string;
    id_empresa?: number;  // Agregar id_empresa

  }

  export interface Datos_referente {
    id: number; //hay que agregarselo para hacer las PK Y FK listo.
    cargoArea: string;
    nombre_apellido: string;
    tipo_telefono: 'Particular' | 'Corporativo';
    numero_telefono: string;
    id_empresa?: number;  // Agregar id_empresa

  }

export interface produccion {
    id: number ;
    producto: string;
    unidad_medida:  
    'METRO (m)' | 
    'METRO CUADRADO (m2)' | 
    'METRO CÚBICO (m3)' | 
    'CENTÍMETRO (cm)' | 
    'CENTÍMETRO CUADRADO (cm2)' | 
    'CENTÍMETRO CÚBICO (cm3)' | 
    'KILOGRAMOS (kg)' | 
    'ONZA (oz)' | 
    'TONELADA (tn)' | 
    'QUINTAL (q)' | 
    'LITROS (lts)' | 
    'HECTOLITROS (hlts)' | 
    'UNIDADES (u)' | 
    'DOCENA (d)' | 
    'DECENA (dc)' | 
    'PACKS (pk)' | 
    'PARES (pr)' | 
    'OTRA UNIDAD' ,
  
    mercado_interno: number | null;
    mercado_externo: number | null;
    id_empresa?: number;  // Agregar id_empresa
    observaciones?: string;

}
export interface UtilizacionInsumos {
  id: number;
  producto: string;
  unidad_medida:  
  'METRO (m)' | 
  'METRO CUADRADO (m2)' | 
  'METRO CÚBICO (m3)' | 
  'CENTÍMETRO (cm)' | 
  'CENTÍMETRO CUADRADO (cm2)' | 
  'CENTÍMETRO CÚBICO (cm3)' | 
  'KILOGRAMOS (kg)' | 
  'ONZA (oz)' | 
  'TONELADA (tn)' | 
  'QUINTAL (q)' | 
  'LITROS (lts)' | 
  'HECTOLITROS (hlts)' | 
  'UNIDADES (u)' | 
  'DOCENA (d)' | 
  'DECENA (dc)' | 
  'PACKS (pk)' | 
  'PARES (pr)' | 
  'OTRA UNIDAD' ,
    cantidad: number;
    monto_pesos: number;
    id_empresa?: number; // Add this line

}


export interface UtilizacionServicio {
    id: number;
    nombre: string;
    monto_pesos: number;
    id_empresa?: number;  // Agregar id_empresa

}

export interface InsumosBasicos {
    id: number;
    tipo:  '4.9. Energía eléctrica consumida (kw/h)' | '4.10. GasOil consumido (litros)' | '4.11. Gas consumido (m3)' | '4.12. Agua consumida (Litros/m3)';
    cantidad: number;
    monto_pesos: number;
    id_empresa?: number;  // Agregar id_empresa

}





export interface manoDeObra {
  id: number;
  tipo:   '4.13. Sueldos y Jornales Brutas totales, incluido SAC y horas extras' | '4.14. Cargas Sociales, incluido A.R.T.' ;
  monto_pesos: number;
  id_empresa?: number;  // Agregar id_empresa
}

  export interface cantidadTrabajadores {
      id: number;
      id_empresa?: number;  // Agregar id_empresa
      plantaAfPermanente: number;
      plantaAfContratado: number;
      plantaResto:        number;
      temporalAfectado:   number;
      temporalResto:      number;
      periodo: string;
  }

  export interface horasNormales {
    id: number;
    id_empresa?: number;  // Agregar id_empresa
    plantaAfPermanente: number;
    plantaAfContratado: number;
    plantaResto:        number;
    temporalAfectado:   number;
    temporalResto:      number;
    periodo: string;
  }

  export interface horasExtras {
    id: number;
    id_empresa?: number;  // Agregar id_empresa
    plantaAfPermanente: number;
    plantaAfContratado: number;
    plantaResto:        number;
    temporalAfectado:   number;
    temporalResto:      number;
    periodo: string;
  }



// constantes



export const tipo = [ 
  '4.9. Energía eléctrica consumida (kw/h)' , '4.10. GasOil consumido (litros)' , '4.11. Gas consumido (m3)' , '4.12. Agua consumida (Litros/m3)'
];

export const unidad_medidas = [
    'METRO (m)', 
    'METRO CUADRADO (m2)', 
    'METRO CÚBICO (m3)', 
    'CENTÍMETRO (cm)', 
    'CENTÍMETRO CUADRADO (cm2)', 
    'CENTÍMETRO CÚBICO (cm3)', 
    'KILOGRAMOS (kg)', 
    'ONZA (oz)', 
    'TONELADA (tn)', 
    'QUINTAL (q)', 
    'LITROS (lts)', 
    'HECTOLITROS (hlts)', 
    'UNIDADES (u)', 
    'DOCENA (d)', 
    'DECENA (dc)', 
    'PACKS (pk)', 
    'PARES (pr)', 
    'OTRA UNIDAD'
  ];


  export const servicios_basicos = [
    '4.9. Energía eléctrica consumida (kw/h)', 
    '4.10. GasOil consumido (litros)', 
    '4.11. Gas consumido (m3)', 
    '4.12. Agua consumida (Litros/m3)', 
  ];
  export const remuneraciones_cargas = [
    '4.13. Sueldos y Jornales Brutas totales, incluido SAC y horas extras' , 
    '4.14. Cargas Sociales, incluido A.R.T.', 
  
  ];



  // paso3
  export interface ItemVenta {
    item: string; // Nombre del item
    monto: number; // Monto asociado
   id_empresa?: number; // Agregar id_empresa
   periodo?: string;

}
  
export interface ventas {
   
  id: number;
  id_empresa?: number; // Agregar id_empresa
  items: ItemVenta[]; // Cambiar a un array de ItemVenta
  // items: '9.1.1 Al mercado interno' | '9.1.2 Al mercado externo'| '9.1.3 Transferencias';
  periodo: string;

}

export interface actividades {
   
  id_empresa?: number; // Agregar id_empresa
  nombre: string;
  monto: number;
  realiza: string;
}


export interface investigacionDesarrollo {
  id:number;
  id_empresa?: number; // Agregar id_empresa
  actividad: actividades[];

}

export interface perspectiva{
  id: number;
  id_empresa?: number; // Agregar id_empresa
  item: items[];
}
export interface items{
  id_empresa?: number; // Agregar id_empresa
  nombre: string;
  observaciones: string;
  respuesta: string;

}
  
export interface Profile {
  id: number;
  name: string;
}

export interface User {
  id: number;
  user: string;
  password: string;
  profileId: number; // Usamos la FK
}

export const profiles: Profile[] = [
  { id: 1, name: 'Supervisor' },
  { id: 2, name: 'Validador' },
  { id: 3, name: 'Ingresador' },
  { id: 4, name: 'Analista' },
  { id: 5, name: 'Coordinador' },
  { id: 6, name: 'Administrador' }

];

export const estado = ['No entregado' , 'No encontrado (no existe)' , 'Cierre definitivo' , 'Rechazado', 'Ausente', 'Entregado', 'Recepcionado', 'Pre-validado', 'Validado', 'Ingresado'];