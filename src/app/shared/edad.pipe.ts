import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'edadMascota' })
export class EdadPipe implements PipeTransform {
  transform(edad: number | null): string {
    if (edad === null) return 'Sin dato';
    if (edad === 0) return 'Menos de 1 año';
    return `${edad} ${edad === 1 ? 'año' : 'años'}`;
  }
}
