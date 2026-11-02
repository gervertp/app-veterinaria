import { Injectable } from '@angular/core';
import { DatosCita } from './cita.model';
import { diaRelativo, fechaHoraPeru } from '../shared/fecha';
import { CrudService } from '../shared/crud.service';

@Injectable({ providedIn: 'root' })
export class CitaService extends CrudService<DatosCita> {
  constructor() {
    // Datos de prueba de citas, con fechas relativas a hoy para que la demo siempre funcione:
    super([
      { id: 1, mascotaId: 1, fecha: diaRelativo(-7), hora: '10:00', motivo: 'Vacunación antirrábica', estado: 'Atendida' },
      { id: 2, mascotaId: 2, fecha: diaRelativo(-1), hora: '11:30', motivo: 'Control general', estado: 'Pendiente' },
      { id: 3, mascotaId: 3, fecha: diaRelativo(1), hora: '09:30', motivo: 'Desparasitación', estado: 'Pendiente' },
      { id: 4, mascotaId: 4, fecha: diaRelativo(3), hora: '15:00', motivo: 'Baño y corte de uñas', estado: 'Pendiente' },
      { id: 5, mascotaId: 1, fecha: diaRelativo(-3), hora: '16:00', motivo: 'Revisión de oído', estado: 'Cancelada' },
      { id: 6, mascotaId: 5, fecha: diaRelativo(-14), hora: '09:00', motivo: 'Cojera en pata trasera', estado: 'Atendida' },
      { id: 7, mascotaId: 6, fecha: diaRelativo(-10), hora: '12:00', motivo: 'Revisión de plumaje', estado: 'Atendida' },
      { id: 8, mascotaId: 7, fecha: diaRelativo(-5), hora: '14:30', motivo: 'Vacuna séxtuple', estado: 'Atendida' },
      { id: 9, mascotaId: 8, fecha: diaRelativo(-2), hora: '11:00', motivo: 'Revisión dental', estado: 'Atendida' },
      { id: 10, mascotaId: 9, fecha: diaRelativo(2), hora: '10:30', motivo: 'Control de peso', estado: 'Pendiente' },
      { id: 11, mascotaId: 10, fecha: diaRelativo(5), hora: '17:00', motivo: 'Limpieza dental', estado: 'Pendiente' },
    ]);
  }

  public get citas(): DatosCita[] {
    return this.registros;
  }

  public marcarAtendida(id: number): void {
    const cita = this.registros.find((cita) => cita.id === id);
    if (cita) cita.estado = 'Atendida';
  }

  // Turnos de 30 minutos, de 09:00 a 18:00.
  public horarios = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ];

  disponibles(fecha: string, excluirId = 0): string[] {
    return this.horarios.filter(
      (hora) =>
        fecha + 'T' + hora > fechaHoraPeru() &&
        !this.horarioOcupado({
          id: excluirId,
          mascotaId: null,
          fecha,
          hora,
          motivo: '',
          estado: 'Pendiente',
        }),
    );
  }

  horarioOcupado(datos: DatosCita): boolean {
    return (
      datos.estado !== 'Cancelada' &&
      this.registros.some(
        (cita) =>
          cita.id !== datos.id &&
          cita.estado !== 'Cancelada' &&
          cita.fecha === datos.fecha &&
          cita.hora === datos.hora,
      )
    );
  }
}
