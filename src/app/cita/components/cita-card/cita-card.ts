import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosCita } from '../../cita.model';
import { CitaProximaDirective } from '../../../shared/cita-proxima.directive';

@Component({
  selector: 'app-cita-card',
  imports: [CommonModule, CitaProximaDirective],
  templateUrl: './cita-card.html',
  styleUrls: ['../../../shared/styles/registros.css', './cita-card.css'],
})
export class CitaCard {
  @Input({ required: true }) cita!: DatosCita;
  @Input() mascota = '';
  @Input() editable = true;
  @Input() mostrarAtencion = false;
  @Input() atendible = false;
  @Output() atender = new EventEmitter<void>();
  @Output() actualizar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();
}
