import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ultimaPagina } from '../paginar.pipe';

@Component({
  selector: 'app-paginacion',
  imports: [CommonModule],
  templateUrl: './paginacion.html',
  styleUrl: './paginacion.css',
})
export class Paginacion {
  @Input({ required: true }) total = 0;
  @Input() porPagina = 5;
  @Input() pagina = 1;
  // Permite usar [(pagina)] desde el componente padre.
  @Output() paginaChange = new EventEmitter<number>();

  public get totalPaginas(): number {
    return ultimaPagina(this.total, this.porPagina);
  }

  public get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, indice) => indice + 1);
  }

  public get desde(): number {
    return this.total === 0 ? 0 : (this.pagina - 1) * this.porPagina + 1;
  }

  public get hasta(): number {
    return Math.min(this.pagina * this.porPagina, this.total);
  }

  public irA(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.pagina) return;
    this.paginaChange.emit(pagina);
  }
}
