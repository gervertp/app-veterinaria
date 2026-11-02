# Necesidades y diseño

## Problema

La clínica recibe solicitudes por teléfono, no cuenta con una agenda digital y tiene dificultades para consultar las atenciones de cada mascota. La aplicación reúne el registro de responsables, mascotas, turnos y atenciones.

## Usuarios y alcance

El personal de recepción registra dueños, mascotas y citas. El personal encargado de la atención consulta y registra el historial. Los datos de contacto del dueño permiten identificar al responsable de la mascota. Esta versión no tiene cuentas ni portal de autoservicio para clientes.

## Flujos

1. **Registro:** Dueños → Registrar nuevo → validar y guardar → Mascotas → Registrar nuevo → seleccionar dueño → guardar.
2. **Agenda:** Citas → Calendario → seleccionar día → elegir turno libre → seleccionar mascota y motivo → guardar. La misma cita aparece en tabla y calendario.
3. **Atención:** Historial → seleccionar mascota → Registrar atención → seleccionar una cita ya ocurrida o «Sin cita» → registrar diagnóstico y tratamiento → guardar.
4. **Consulta:** Historial → filtrar mascota → consultar atenciones de la más reciente a la más antigua y revisar sus citas.
5. **Corrección:** actualizar mediante el icono de lápiz. Cancelar descarta el formulario. Eliminar pide confirmación y respeta las asociaciones entre registros.

## Esquema de pantallas

```text
┌──────────────┬──────────────────────────────────────────┐
│ Veterinaria  │ Título                  [Registrar nuevo]│
│              │                                          │
│ Dueños       │ Tabla con registros y acciones            │
│ Mascotas     │                                          │
│ Citas        │                          [lápiz] [papelera]│
│ Historial    │ Cantidad de registros                     │
└──────────────┴──────────────────────────────────────────┘

Citas / Calendario
┌────────────────────────────┬───────────────────────────┐
│ Mes              [<][Hoy][>]│ Día seleccionado          │
│ Lun Mar Mié Jue Vie Sáb Dom │ Turnos libres [09:00] ...  │
│ Días y cantidad de citas   │ Citas ordenadas por hora  │
└────────────────────────────┴───────────────────────────┘

Modal
┌─────────────────────────────────────┐
│ Registrar / Editar                [×]│
│ Campos y validaciones               │
│             [Cancelar] [Guardar]    │
└─────────────────────────────────────┘
```

En móvil se conserva la barra lateral como una columna de iconos. El calendario y la agenda se apilan. Las tablas se desplazan dentro de su contenedor y los modales caben dentro de la pantalla.

## Relaciones

- Un dueño puede tener varias mascotas.
- Cada mascota pertenece a un dueño.
- Cada cita corresponde a una mascota.
- Cada atención corresponde a una mascota y opcionalmente a una cita.
- Las asociaciones usan identificadores, no posiciones del arreglo ni nombres.

## Límites de la demostración

Una sola atención por turno; sin asignación de veterinarios ni consultorios. Horario fijo de demostración de 09:00 a 18:00. Sin backend, autenticación ni persistencia tras recargar. Los servicios permiten agregar estas capacidades posteriormente sin mezclar su lógica con los campos del formulario.
