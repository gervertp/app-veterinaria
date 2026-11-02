import { Injectable } from '@angular/core';
import { DatosHistorial } from './historial.model';
import { CrudService } from '../shared/crud.service';
import { diaRelativo } from '../shared/fecha';

@Injectable({ providedIn: 'root' })
export class HistorialService extends CrudService<DatosHistorial> {
  constructor() {
    // Datos de prueba del historial (citaId apunta a las citas de CitaService):
    super([
      {
        id: 1, mascotaId: 1, citaId: 1, fecha: diaRelativo(-7),
        diagnostico: 'Paciente sano, apto para vacunación.',
        tratamiento: 'Vacuna antirrábica aplicada.',
        observaciones: 'Próxima dosis en un año.',
      },
      {
        id: 2, mascotaId: 2, citaId: null, fecha: diaRelativo(-30),
        diagnostico: 'Conjuntivitis leve en el ojo derecho.',
        tratamiento: 'Gotas oftálmicas cada 8 horas por 5 días.',
        observaciones: '',
      },
      {
        id: 3, mascotaId: 5, citaId: 6, fecha: diaRelativo(-14),
        diagnostico: 'Esguince leve en la pata trasera izquierda.',
        tratamiento: 'Antiinflamatorio por 5 días y reposo.',
        observaciones: 'Control en dos semanas.',
      },
      {
        id: 4, mascotaId: 6, citaId: 7, fecha: diaRelativo(-10),
        diagnostico: 'Pérdida de plumas por estrés.',
        tratamiento: 'Suplemento vitamínico en el agua.',
        observaciones: 'Evitar cambios bruscos de ambiente.',
      },
      {
        id: 5, mascotaId: 7, citaId: 8, fecha: diaRelativo(-5),
        diagnostico: 'Paciente sano.',
        tratamiento: 'Vacuna séxtuple aplicada.',
        observaciones: 'Refuerzo en 21 días.',
      },
      {
        id: 6, mascotaId: 8, citaId: 9, fecha: diaRelativo(-2),
        diagnostico: 'Crecimiento excesivo de los incisivos.',
        tratamiento: 'Limado dental.',
        observaciones: 'Dieta con más heno.',
      },
      {
        id: 7, mascotaId: 1, citaId: null, fecha: diaRelativo(-60),
        diagnostico: 'Otitis externa.',
        tratamiento: 'Gotas óticas cada 12 horas por 7 días.',
        observaciones: '',
      },
      {
        id: 8, mascotaId: 3, citaId: null, fecha: diaRelativo(-20),
        diagnostico: 'Diarrea leve por cambio de alimento.',
        tratamiento: 'Dieta blanda y probióticos por 3 días.',
        observaciones: 'Volver al alimento habitual de forma gradual.',
      },
      {
        id: 9, mascotaId: 4, citaId: null, fecha: diaRelativo(-45),
        diagnostico: 'Bolas de pelo.',
        tratamiento: 'Pasta de malta dos veces por semana.',
        observaciones: 'Cepillado diario.',
      },
      {
        id: 10, mascotaId: 9, citaId: null, fecha: diaRelativo(-90),
        diagnostico: 'Sobrepeso.',
        tratamiento: 'Alimento light y más actividad física.',
        observaciones: 'Control de peso en un mes.',
      },
      {
        id: 11, mascotaId: 10, citaId: null, fecha: diaRelativo(-15),
        diagnostico: 'Sarro dental moderado.',
        tratamiento: 'Programar limpieza dental.',
        observaciones: '',
      },
      {
        id: 12, mascotaId: 11, citaId: null, fecha: diaRelativo(-8),
        diagnostico: 'Revisión general, paciente sano.',
        tratamiento: 'Ninguno.',
        observaciones: 'Primera visita.',
      },
      {
        id: 13, mascotaId: 2, citaId: null, fecha: diaRelativo(-120),
        diagnostico: 'Esterilización.',
        tratamiento: 'Cirugía y antibiótico por 5 días.',
        observaciones: 'Retiro de puntos a los 10 días.',
      },
    ]);
  }

  public get registrosHistorial(): DatosHistorial[] {
    return this.registros;
  }
}
