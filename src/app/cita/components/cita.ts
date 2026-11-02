import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { coincideBusqueda } from '../../shared/busqueda';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';
import { HistorialService } from '../../historial/historial.service';
import { CitaCard } from './cita-card/cita-card';
import { CitaProximaDirective } from '../../shared/cita-proxima.directive';
import { fechaHoraPeru } from '../../shared/fecha';
import { PaginarPipe, ultimaPagina } from '../../shared/paginar.pipe';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { MascotaService } from '../../mascota/mascota.service';
import { CitaService } from '../cita.service';
import { DatosCita, EstadoCita } from '../cita.model';

@Component({
  imports: [CommonModule, FormsModule, CitaCard, CitaProximaDirective, PaginarPipe, Paginacion],
  selector: 'app-cita',
  styleUrls: ['../../shared/styles/registros.css', './cita.css'],
  templateUrl: './cita.html',
})
export class Cita {
  constructor(
    public mascotaService: MascotaService,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef,
    private historialService: HistorialService,
    private router: Router,
  ) {}

  public busqueda = '';

  // Paginación: 5 registros por página.
  public pagina = 1;
  public porPagina = 5;

  public datosCita: DatosCita = {
    id: 0,
    mascotaId: null,
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'Pendiente',
  };

  @ViewChild('formulario') formulario!: NgForm;

  public estados: EstadoCita[] = ['Pendiente', 'Atendida', 'Cancelada'];
  public error = '';
  public vista: 'tabla' | 'calendario' = 'tabla';
  public fechaSeleccionada = this.fechaHoraActual().slice(0, 10);
  public mesVisible = this.fechaSeleccionada.slice(0, 7);
  public diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  public diasCalendario: (string | null)[] = this.crearCalendario();

  @ViewChild('modalCita') modalCita!: ElementRef<HTMLDialogElement>;

  public get mensajeVacio(): string {
    return this.busqueda.trim() ? 'No se encontraron coincidencias.' : 'No hay registros.';
  }

  public get citasFiltradas(): DatosCita[] {
    return this.citas.filter((cita) =>
      coincideBusqueda(
        this.busqueda,
        this.nombreMascota(cita.mascotaId),
        cita.motivo,
        cita.estado,
        cita.fecha,
        cita.fecha.split('-').reverse().join('/'),
        cita.hora,
      ),
    );
  }

  public get citas(): DatosCita[] {
    return this.citaService.listar();
  }

  public get tituloMes(): string {
    const [anio, mes] = this.mesVisible.split('-').map(Number);
    return new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(
      new Date(anio, mes - 1, 1),
    );
  }

  public citasDelDia(fecha: string): DatosCita[] {
    return this.citasFiltradas
      .filter((cita) => cita.fecha === fecha)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  public esHoy(fecha: string): boolean {
    return fecha === this.fechaHoraActual().slice(0, 10);
  }

  private crearCalendario(): (string | null)[] {
    const [anio, mes] = this.mesVisible.split('-').map(Number);
    const inicio = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
    const cantidad = new Date(anio, mes, 0).getDate();
    const dias: (string | null)[] = Array(inicio).fill(null);
    for (let dia = 1; dia <= cantidad; dia++) {
      dias.push(`${this.mesVisible}-${String(dia).padStart(2, '0')}`);
    }
    while (dias.length % 7 !== 0) dias.push(null);
    return dias;
  }

  public cambiarMes(cambio: number): void {
    const [anio, mes] = this.mesVisible.split('-').map(Number);
    const fecha = new Date(anio, mes - 1 + cambio, 1);
    this.mesVisible = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    this.fechaSeleccionada = this.mesVisible + '-01';
    this.diasCalendario = this.crearCalendario();
  }

  public irAHoy(): void {
    this.fechaSeleccionada = this.fechaHoraActual().slice(0, 10);
    this.mesVisible = this.fechaSeleccionada.slice(0, 7);
    this.diasCalendario = this.crearCalendario();
  }

  public registrarEnFecha(): void {
    this.abrirRegistro();
    if (this.modalCita.nativeElement.open) {
      this.datosCita.fecha = this.fechaSeleccionada;
    }
  }

  private crearFormulario(): DatosCita {
    return { id: 0, mascotaId: null, fecha: '', hora: '', motivo: '', estado: 'Pendiente' };
  }

  private fechaHoraActual(): string {
    return fechaHoraPeru();
  }

  public get horasDisponibles(): string[] {
    return this.citaService.disponibles(this.datosCita.fecha, this.datosCita.id);
  }

  public horariosDelDia(): string[] {
    return this.citaService.disponibles(this.fechaSeleccionada);
  }

  public reservarHora(hora: string): void {
    this.registrarEnFecha();
    if (this.modalCita.nativeElement.open) this.datosCita.hora = hora;
  }

  public cambiarFecha(): void {
    this.datosCita.hora = '';
  }

  public nombreMascota(id: number | null): string {
    return (
      this.mascotaService.mascotas.find((mascota) => mascota.id === id)?.nombre ?? 'Sin mascota'
    );
  }

  public abrirRegistro(): void {
    if (this.mascotaService.mascotas.length === 0) {
      void Swal.fire({
        title: 'No hay mascotas registradas',
        text: 'Registra una mascota para continuar.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7c4dff',
      });
      return;
    }
    this.datosCita = this.crearFormulario();
    this.formulario.resetForm(this.datosCita);
    this.error = '';
    this.modalCita.nativeElement.showModal();
  }

  public puedeAtender(cita: DatosCita): boolean {
    return (
      cita.estado === 'Pendiente' &&
      cita.fecha + 'T' + cita.hora <= fechaHoraPeru() &&
      !this.historialService.registrosHistorial.some((registro) => registro.citaId === cita.id)
    );
  }

  public registrarAtencion(cita: DatosCita): void {
    if (this.historialService.registrosHistorial.some((registro) => registro.citaId === cita.id)) {
      void Swal.fire({
        title: 'Esta cita ya tiene una atención registrada',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    if (cita.estado !== 'Pendiente') {
      void Swal.fire({
        title: 'Solo puedes atender citas pendientes',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    if (cita.fecha + 'T' + cita.hora > fechaHoraPeru()) {
      void Swal.fire({
        title: 'Todavía no es la hora de la cita',
        text: `Puedes registrar la atención desde el ${cita.fecha.split('-').reverse().join('/')} a las ${cita.hora}.`,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7c4dff',
      });
      return;
    }
    void this.router.navigate(['/historial'], { queryParams: { cita: cita.id } });
  }

  public editarCita(cita: DatosCita): void {
    this.datosCita = { ...cita };
    this.formulario.resetForm(this.datosCita);
    this.error = '';
    this.modalCita.nativeElement.showModal();
  }

  public cerrarModal(): void {
    this.modalCita.nativeElement.close();
  }

  public registrarCita(formularioValido: boolean): void {
    this.error = '';
    if (!formularioValido) return;
    if (!this.mascotaService.mascotas.some((mascota) => mascota.id === this.datosCita.mascotaId)) {
      this.error = 'Selecciona una mascota registrada.';
      return;
    }
    if (
      this.datosCita.estado === 'Atendida' &&
      this.datosCita.fecha + 'T' + this.datosCita.hora > this.fechaHoraActual()
    ) {
      this.error = 'Una cita futura no puede marcarse como atendida.';
      return;
    }
    const historia = this.historialService.registrosHistorial.find(
      (registro) => registro.citaId === this.datosCita.id,
    );
    if (
      historia &&
      (historia.mascotaId !== this.datosCita.mascotaId ||
        historia.fecha !== this.datosCita.fecha ||
        this.datosCita.estado !== 'Atendida')
    ) {
      this.error = 'La mascota, fecha y estado deben coincidir con la atención registrada.';
      return;
    }
    const original = this.citas.find((cita) => cita.id === this.datosCita.id);
    const cambiaHorario =
      !original || original.fecha !== this.datosCita.fecha || original.hora !== this.datosCita.hora;
    if (
      cambiaHorario &&
      this.datosCita.fecha + 'T' + this.datosCita.hora <= this.fechaHoraActual()
    ) {
      this.error = 'Selecciona una fecha y hora futuras.';
      return;
    }
    if (!this.citaService.horarios.includes(this.datosCita.hora)) {
      this.error = 'Elige un turno entre las 09:00 y las 17:30.';
      return;
    }
    if (this.citaService.horarioOcupado(this.datosCita)) {
      this.error = 'Ese horario ya está ocupado. Elige otra hora.';
      return;
    }

    const datos = { ...this.datosCita, motivo: this.datosCita.motivo.trim() };
    let titulo = '';
    if (this.datosCita.id === 0) {
      this.citaService.registrar(datos);
      this.pagina = ultimaPagina(this.citasFiltradas.length, this.porPagina);
      titulo = 'Cita registrada.';
    } else {
      this.citaService.actualizar(datos);
      titulo = 'Cita actualizada.';
    }
    this.fechaSeleccionada = datos.fecha;
    this.mesVisible = datos.fecha.slice(0, 7);
    this.diasCalendario = this.crearCalendario();
    this.cerrarModal();
    this.mostrarExito(titulo);
  }

  public async confirmarEliminacion(cita: DatosCita): Promise<void> {
    if (this.historialService.registrosHistorial.some((registro) => registro.citaId === cita.id)) {
      void Swal.fire({
        title: 'La cita tiene una atención registrada',
        text: 'Conserva la cita para mantener el historial.',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    const respuesta = await Swal.fire({
      title: '¿Eliminar cita?',
      text: `${this.nombreMascota(cita.mascotaId)} · ${cita.fecha} ${cita.hora}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#76717e',
      focusCancel: true,
    });
    if (respuesta.isConfirmed) {
      this.citaService.eliminar(cita.id);
      this.pagina = Math.min(this.pagina, ultimaPagina(this.citasFiltradas.length, this.porPagina));
      this.cdr.markForCheck();
      this.mostrarExito('Cita eliminada.');
    }
  }

  private mostrarExito(titulo: string): void {
    void Swal.fire({ title: titulo, icon: 'success', timer: 1800, showConfirmButton: false });
  }
}
