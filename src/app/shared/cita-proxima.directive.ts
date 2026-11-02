import { Directive, HostBinding, Input } from '@angular/core';
import { DatosCita } from '../cita/cita.model';

@Directive({ selector: '[citaProxima]' })
export class CitaProximaDirective {
  @Input() citaProxima!: DatosCita;

  @HostBinding('style.border-left')
  get borde(): string | null {
    if (!this.citaProxima || this.citaProxima.estado !== 'Pendiente') return null;
    const hora = new Date(`${this.citaProxima.fecha}T${this.citaProxima.hora}:00-05:00`).getTime();
    const diferencia = hora - Date.now();
    return diferencia >= 0 && diferencia <= 86400000 ? '3px solid #7c4dff' : null;
  }
}
