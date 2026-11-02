import { Injectable } from '@angular/core';
import { DatosDueno } from './dueno.model';
import { CrudService } from '../shared/crud.service';

@Injectable({ providedIn: 'root' })
export class DuenoService extends CrudService<DatosDueno> {
  constructor() {
    // Datos de prueba de dueños:
    super([
      { id: 1, nombres: 'Carlos', apellidos: 'Mendoza Ríos', dni: '45871236', telefono: '987654321', correo: 'carlos.mendoza@gmail.com' },
      { id: 2, nombres: 'María', apellidos: 'Fernández Soto', dni: '70214589', telefono: '912345678', correo: 'maria.fernandez@hotmail.com' },
      { id: 3, nombres: 'Luis', apellidos: 'Quispe Huamán', dni: '41236987', telefono: '956781234', correo: 'luis.quispe@outlook.com' },
      { id: 4, nombres: 'Ana', apellidos: 'Torres Vargas', dni: '46123578', telefono: '945612378', correo: 'ana.torres@gmail.com' },
      { id: 5, nombres: 'Jorge', apellidos: 'Ramírez Castillo', dni: '72345681', telefono: '923456781', correo: 'jorge.ramirez@yahoo.com' },
      { id: 6, nombres: 'Rosa', apellidos: 'Chávez Flores', dni: '40987123', telefono: '934567812', correo: 'rosa.chavez@gmail.com' },
      { id: 7, nombres: 'Pedro', apellidos: 'Sánchez Paredes', dni: '71456239', telefono: '976543218', correo: 'pedro.sanchez@hotmail.com' },
      { id: 8, nombres: 'Lucía', apellidos: 'Gutiérrez Rojas', dni: '47581236', telefono: '998877665', correo: 'lucia.gutierrez@gmail.com' },
      { id: 9, nombres: 'Miguel', apellidos: 'Herrera Díaz', dni: '06543217', telefono: '965432187', correo: 'miguel.herrera@outlook.com' },
      { id: 10, nombres: 'Carmen', apellidos: 'Vega Salazar', dni: '43219876', telefono: '912398745', correo: 'carmen.vega@gmail.com' },
      { id: 11, nombres: 'Diego', apellidos: 'Castro Medina', dni: '74125896', telefono: '987123456', correo: 'diego.castro@gmail.com' },
      { id: 12, nombres: 'Valeria', apellidos: 'Ríos Campos', dni: '75896321', telefono: '951753852', correo: 'valeria.rios@hotmail.com' },
    ]);
  }

  public get duenos(): DatosDueno[] {
    return this.registros;
  }
}
