# Veterinaria

Aplicación Angular para registrar dueños y mascotas, organizar citas y consultar el historial de atención de cada mascota. Proyecto para la evaluación parcial de Desarrollo de Interfaces 3.

## Instalación y ejecución

Entorno comprobado: Node.js 24.21.0 y npm 12.1.0. Las dependencias exactas están en `package-lock.json`.

```bash
npm ci
npm start
```

Abrir `http://localhost:4200`. Para comprobar el proyecto:

```bash
npm run build
```

La compilación se genera en `dist/app_veterinaria/browser`. Las rutas SPA requieren redirigir las URL no encontradas a `index.html` al desplegar.

## Funcionalidades

| Ruta         | Pantalla  | Operaciones                                                                    |
| ------------ | --------- | ------------------------------------------------------------------------------ |
| `/duenos`    | Dueños    | Registrar, listar, actualizar y eliminar; validación de DNI repetido.          |
| `/mascotas`  | Mascotas  | Registrar y administrar mascotas, seleccionando su dueño. «Otro» permite escribir la especie. |
| `/citas`     | Citas     | Registrar y administrar citas; tabla y calendario mensual; turnos disponibles. |
| `/historial` | Historial | Registrar atenciones, filtrar por mascota y consultar sus citas.               |

Las rutas usan importaciones directas y la propiedad `component`. La entrada y las rutas desconocidas redirigen a `/duenos`. No hay autenticación ni guards.

Las cuatro pantallas incluyen búsqueda por texto, sin distinguir mayúsculas ni tildes. En Historial se combina con el filtro por mascota; en el calendario no modifica la disponibilidad real de los turnos.

### Cómo se reparte el código

- **HTML:** muestra los campos, botones y registros; usa `ngModel` y `ngForm`.
- **Componente:** valida la operación, controla el modal y muestra los avisos.
- **Servicio:** hereda `listar()`, `registrar()`, `actualizar()` y `eliminar()` de `CrudService<T>`. Actualiza y elimina por identificador.
- **Modelo:** define los campos y sus tipos.

El componente llama al servicio para modificar los registros; no hace `push`, `splice` ni reemplaza elementos del arreglo. Los cuatro servicios heredan esas operaciones de la clase abstracta `CrudService<T>` (`shared/crud.service.ts`).

### Reglas de funcionamiento

- Los dueños y las mascotas tienen identificadores estables; una edición conserva las asociaciones.
- No se puede eliminar un dueño con mascotas ni una mascota con citas o atenciones.
- La agenda utiliza la hora de Perú (`America/Lima`).
- Horario de demostración: todos los días, de 09:00 a 18:00, con turnos de 30 minutos. El último turno empieza a las 17:30. Se configura en `CitaService.horarios`.
- La agenda representa una sola atención simultánea: dos citas activas no pueden reservar el mismo turno. Una cita cancelada libera su horario.
- Se rechazan nuevas citas en el pasado y las citas futuras no pueden marcarse como atendidas.
- El botón verde de Citas abre Historial con la cita y la mascota seleccionadas. Si la cita todavía es futura, muestra un aviso con su fecha y hora; al llegar el turno abre el formulario de atención. Guardar la atención cambia el estado a «Atendida»; cancelar mantiene «Pendiente».
- Historial registra fecha, diagnóstico, tratamiento y observaciones opcionales. Se admiten atenciones sin cita previa.
- Una atención puede vincularse a una cita no cancelada cuya fecha y hora ya hayan ocurrido. Al guardarla, la cita pasa a «Atendida». Cada cita puede tener una sola atención vinculada.
- Una cita con atención vinculada no se puede eliminar ni cambiar a otra mascota, fecha o estado distinto de «Atendida».
- Eliminar una atención no cambia la cita a pendiente: la atención ya ocurrió.

Los servicios conservan los datos al navegar. No hay base de datos: como en el ejemplo de matrícula, los datos de prueba están escritos en el código. Cada servicio los pasa a `CrudService<T>` desde su constructor (`super([...])`):

- 12 dueños (dos sin mascotas, para probar la eliminación), 11 mascotas (Rocky con edad 0 para el pipe; Pepa, un hámster registrado con «Otro») y 13 atenciones en el historial.
- 11 citas con fechas relativas a hoy (`diaRelativo()` en `shared/fecha.ts`): una atendida hace 7 días, una pendiente de ayer (lista para registrar atención), una para mañana (resaltada por `citaProxima`), otras futuras, varias atendidas con su atención en el historial y una cancelada.

**Al recargar se vuelve a estos datos iniciales** y se pierden los cambios hechos durante la sesión.

## Estructura

```text
src/app/
├── dueno/          # Modelo, servicio y componente de dueños
├── mascota/        # Modelo, servicio y components/
├── cita/           # Modelo, servicio y components/ (agenda y CitaCard)
├── historial/      # Modelo, servicio y components/
└── shared/
    ├── crud.service.ts            # Clase abstracta CrudService<T>
    ├── fecha.ts                   # Fecha y hora de Perú
    ├── edad.pipe.ts               # Presentación de la edad
    ├── paginar.pipe.ts            # Registros de la página actual
    ├── paginacion/                # Componente de paginación (Bootstrap)
    ├── cita-proxima.directive.ts  # Resaltado de citas próximas
    └── styles/registros.css       # Estilos compartidos de tablas y modales
```

La organización es por funcionalidad y usa componentes standalone. No se crean `NgModule`; los imports de cada pantalla declaran sus dependencias.

### Aspectos técnicos

- **TypeScript y POO:** interfaces de dominio, clases de componentes y servicios, funciones tipadas y unión `EstadoCita`. Los servicios extienden la clase abstracta y genérica `CrudService<T extends { id: number }>` (abstracción, herencia y genéricos). La lista es `protected` y el contador de identificadores `private` (encapsulamiento); cada servicio la expone con un getter de solo lectura y agrega sus propios métodos, como `CitaService.marcarAtendida()` y `disponibles()`.
- **Formularios:** `FormsModule`, objetos de datos, `[(ngModel)]` y `#formulario="ngForm"`. Los atributos `required`, `pattern`, `email`, `min`, `max` y `maxlength` validan los campos. Al enviar se pasa `formulario.valid` al método del componente. Cancelar no modifica el registro original.
- **Componente reutilizable:** `CitaCard` se usa en Calendario e Historial. Recibe `cita`, `mascota` y `editable` mediante `@Input`; comunica `actualizar` y `eliminar` mediante `@Output`.
- **Pipes personalizados:** `edadMascota` presenta «Menos de 1 año», «1 año» o «N años» en la tabla de mascotas. `paginar` devuelve solo los registros de la página actual.
- **Paginación:** las cuatro tablas muestran 5 registros por página con el componente `Paginacion` (`[(pagina)]` mediante `@Input` y `@Output`) y el componente `pagination` de Bootstrap. Buscar o filtrar vuelve a la página 1.
- **Directiva personalizada:** `citaProxima` marca con una línea las citas pendientes que comienzan en las próximas 24 horas. Se usa en la tabla y en las tarjetas.
- **Bootstrap:** tablas con filas alternadas, formularios, botones y clases de distribución. Los formularios se abren en un `dialog` nativo estilizado con Bootstrap, con foco contenido y cierre mediante Escape. Las confirmaciones y los avisos usan SweetAlert2.

## Iconos y estilos

Bootstrap Icons se instala como dependencia. Para reducir la carga inicial, `scripts/generar-iconos.mjs` extrae del CSS original únicamente las clases presentes en los HTML. Conserva la fuente, los glifos y el aviso de licencia de la librería.

```bash
npm run icons
```

Se ejecuta automáticamente antes de iniciar o compilar. Si se agrega un icono mientras el servidor ya está abierto, ejecutar el comando nuevamente.

SweetAlert2 utiliza su distribución ESM para evitar advertencias de CommonJS. Los estilos propios se inspiran en Materialize Admin: menú lateral claro y compacto, acento violeta, tablas y modales adaptables. Se mantienen Bootstrap y Bootstrap Icons; no se instala la plantilla comercial.

## Documentación

- [Necesidades, flujos y esquema de pantallas](docs/DISEÑO.md).

## Entrega

El proyecto se entrega en un archivo comprimido sin las carpetas `node_modules`, `dist` ni `.angular`. Para ejecutarlo, descomprimir, abrir una terminal en la carpeta del proyecto y seguir los pasos de [Instalación y ejecución](#instalación-y-ejecución).
