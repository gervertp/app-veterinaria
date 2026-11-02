export function fechaHoraPeru(fecha = new Date()): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha);
  const valor = (tipo: string) => partes.find(parte => parte.type === tipo)?.value;
  return `${valor('year')}-${valor('month')}-${valor('day')}T${valor('hour')}:${valor('minute')}`;
}

// Fecha (aaaa-mm-dd) desplazada desde hoy en Perú; útil para los datos de prueba.
export function diaRelativo(dias: number): string {
  const fecha = new Date(fechaHoraPeru().slice(0, 10) + 'T00:00:00Z');
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}
