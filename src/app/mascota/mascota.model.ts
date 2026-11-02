export interface DatosMascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number | null;
  sexo: string;
  duenoId: number | null;
}
