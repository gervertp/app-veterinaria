// Permite buscar sin distinguir mayúsculas ni tildes.
export function coincideBusqueda(busqueda: string, ...valores: (string | number | null)[]): boolean {
  const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  const contenido = normalizar(valores.join(' '));
  return normalizar(busqueda).trim().split(/\s+/).every(palabra => contenido.includes(palabra));
}
