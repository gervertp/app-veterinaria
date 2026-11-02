import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Conserva la fuente y solo las clases de Bootstrap Icons utilizadas en las vistas.
function plantillas(directorio) {
  return readdirSync(directorio, { withFileTypes: true }).flatMap(entrada => {
    const ruta = join(directorio, entrada.name);
    return entrada.isDirectory() ? plantillas(ruta) : ruta.endsWith('.html') ? [ruta] : [];
  });
}
const usados = new Set(plantillas('src/app').flatMap(ruta => [...readFileSync(ruta, 'utf8').matchAll(/\bbi-[a-z0-9-]+\b/g)].map(coincidencia => coincidencia[0])));
const fuente = readFileSync('node_modules/bootstrap-icons/font/bootstrap-icons.css', 'utf8');
const cabecera = fuente.slice(0, fuente.indexOf('.bi-123::before')).replaceAll('./fonts/', 'bootstrap-icons/font/fonts/');
const clases = [...usados].sort().map(nombre => {
  const regla = fuente.match(new RegExp(`\\.${nombre}::before \\{[^}]+\\}`));
  if (!regla) throw new Error(`Icono desconocido: ${nombre}`);
  return regla[0];
});
writeFileSync('src/bootstrap-icons.css', cabecera + clases.join('\n') + '\n');
console.log(`Bootstrap Icons: ${clases.length} iconos incluidos.`);
