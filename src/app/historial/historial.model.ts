export interface DatosHistorial {
  id: number;
  mascotaId: number | null;
  citaId: number | null;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}
