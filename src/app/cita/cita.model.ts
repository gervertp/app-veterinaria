export type EstadoCita = 'Pendiente' | 'Atendida' | 'Cancelada';

export interface DatosCita {
  id: number;
  mascotaId: number | null;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
}
