import { Pipe, PipeTransform } from '@angular/core';

// Cantidad de páginas para un total de registros (como mínimo 1).
export function ultimaPagina(total: number, porPagina: number): number {
  return Math.max(1, Math.ceil(total / porPagina));
}

// Devuelve solo los registros de la página indicada.
@Pipe({ name: 'paginar' })
export class PaginarPipe implements PipeTransform {
  transform<T>(registros: T[], pagina: number, porPagina: number): T[] {
    const inicio = (pagina - 1) * porPagina;
    return registros.slice(inicio, inicio + porPagina);
  }
}
