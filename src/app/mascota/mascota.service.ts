import { Injectable } from '@angular/core';
import { DatosMascota } from './mascota.model';
import { CrudService } from '../shared/crud.service';

@Injectable({ providedIn: 'root' })
export class MascotaService extends CrudService<DatosMascota> {
  constructor() {
    // Datos de prueba de mascotas (duenoId apunta a los dueños de DuenoService):
    super([
      { id: 1, nombre: 'Firulais', especie: 'Perro', raza: 'Labrador', edad: 3, sexo: 'Macho', duenoId: 1 },
      { id: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siamés', edad: 2, sexo: 'Hembra', duenoId: 2 },
      { id: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Bulldog', edad: 0, sexo: 'Macho', duenoId: 3 },
      { id: 4, nombre: 'Luna', especie: 'Gato', raza: 'Persa', edad: 1, sexo: 'Hembra', duenoId: 1 },
      { id: 5, nombre: 'Max', especie: 'Perro', raza: 'Pastor Alemán', edad: 5, sexo: 'Macho', duenoId: 4 },
      { id: 6, nombre: 'Coco', especie: 'Ave', raza: 'Loro', edad: 8, sexo: 'Macho', duenoId: 5 },
      { id: 7, nombre: 'Nala', especie: 'Perro', raza: 'Golden Retriever', edad: 4, sexo: 'Hembra', duenoId: 6 },
      { id: 8, nombre: 'Bugs', especie: 'Conejo', raza: 'Belier', edad: 1, sexo: 'Macho', duenoId: 7 },
      { id: 9, nombre: 'Simba', especie: 'Gato', raza: 'Mestizo', edad: 6, sexo: 'Macho', duenoId: 8 },
      { id: 10, nombre: 'Toby', especie: 'Perro', raza: 'Shih Tzu', edad: 10, sexo: 'Macho', duenoId: 9 },
      // Especie que no está en la lista: se registró con la opción "Otro".
      { id: 11, nombre: 'Pepa', especie: 'Hámster', raza: 'Sirio', edad: 1, sexo: 'Hembra', duenoId: 10 },
    ]);
  }

  public get mascotas(): DatosMascota[] {
    return this.registros;
  }
}
