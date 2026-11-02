import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { coincideBusqueda } from '../../shared/busqueda';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';
import { PaginarPipe, ultimaPagina } from '../../shared/paginar.pipe';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { MascotaService } from '../../mascota/mascota.service';
import { CitaService } from '../../cita/cita.service';
import { HistorialService } from '../historial.service';
import { DatosHistorial } from '../historial.model';
import { CitaCard } from '../../cita/components/cita-card/cita-card';
import { fechaHoraPeru } from '../../shared/fecha';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, FormsModule, CitaCard, PaginarPipe, Paginacion],
  templateUrl: './historial.html',
  styleUrls: ['../../shared/styles/registros.css', './historial.css'],
})
export class Historial implements AfterViewInit {
  constructor(
    public mascotaService: MascotaService,
    public citaService: CitaService,
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public busqueda = '';

  // Paginación: 5 registros por página.
  public pagina = 1;
  public porPagina = 5;
  public filtroMascota: number | null = null;
  public error = '';
  public datosHistorial: DatosHistorial = {
    id: 0,
    mascotaId: null,
    citaId: null,
    fecha: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  };

  @ViewChild('formulario') formulario!: NgForm;

  @ViewChild('modalHistorial') modal!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit(): void {
    const parametro = this.route.snapshot.queryParamMap.get('cita');
    if (!parametro) return;
    // El diálogo debe estar renderizado antes de abrirlo desde la agenda.
    queueMicrotask(() => {
      const cita = this.citaService.citas.find((cita) => cita.id === Number(parametro));
      const yaRegistrada = this.historialService.registrosHistorial.some(
        (registro) => registro.citaId === Number(parametro),
      );
      if (
        cita &&
        cita.estado === 'Pendiente' &&
        cita.fecha + 'T' + cita.hora <= fechaHoraPeru() &&
        !yaRegistrada
      ) {
        this.filtroMascota = cita.mascotaId;
        this.abrirRegistro();
        Object.assign(this.datosHistorial, {
          mascotaId: cita.mascotaId,
          citaId: cita.id,
          fecha: cita.fecha,
        });
      } else {
        void Swal.fire({
          title: 'La cita no está disponible para registrar atención',
          icon: 'info',
          confirmButtonText: 'Entendido',
        });
      }
      this.cdr.markForCheck();
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { cita: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  public get mensajeVacio(): string {
    return this.busqueda.trim()
      ? 'No se encontraron coincidencias.'
      : 'No hay atenciones registradas.';
  }

  public get hoy(): string {
    return fechaHoraPeru().slice(0, 10);
  }

  public get registros(): DatosHistorial[] {
    return this.historialService
      .listar()
      .filter(
        (registro) =>
          (this.filtroMascota === null || registro.mascotaId === this.filtroMascota) &&
          coincideBusqueda(
            this.busqueda,
            this.nombreMascota(registro.mascotaId),
            registro.fecha,
            registro.fecha.split('-').reverse().join('/'),
            registro.diagnostico,
            registro.tratamiento,
            registro.observaciones,
          ),
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }

  public get citasParaVincular() {
    const datos = this.datosHistorial;
    return this.citaService.citas.filter(
      (cita) =>
        cita.mascotaId === datos.mascotaId &&
        cita.estado !== 'Cancelada' &&
        cita.fecha + 'T' + cita.hora <= fechaHoraPeru() &&
        !this.historialService.registrosHistorial.some(
          (registro) => registro.citaId === cita.id && registro.id !== datos.id,
        ),
    );
  }

  public get citasDeMascota() {
    return this.citaService.citas
      .filter((cita) => cita.mascotaId === this.filtroMascota)
      .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }

  public nombreMascota(id: number | null): string {
    return (
      this.mascotaService.mascotas.find((mascota) => mascota.id === id)?.nombre ?? 'Sin mascota'
    );
  }

  public abrirRegistro(): void {
    if (!this.mascotaService.mascotas.length) {
      void Swal.fire({
        title: 'No hay mascotas registradas',
        text: 'Registra una mascota para continuar.',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    this.error = '';
    this.datosHistorial = {
      id: 0,
      mascotaId: this.filtroMascota,
      citaId: null,
      fecha: this.hoy,
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
    };
    this.formulario.resetForm(this.datosHistorial);
    this.modal.nativeElement.showModal();
  }

  public editar(registro: DatosHistorial): void {
    this.error = '';
    this.datosHistorial = { ...registro };
    this.formulario.resetForm(this.datosHistorial);
    this.modal.nativeElement.showModal();
  }

  public cambiarMascota(): void {
    this.datosHistorial.citaId = null;
  }

  public seleccionarCita(): void {
    const cita = this.citaService.citas.find((cita) => cita.id === this.datosHistorial.citaId);
    if (cita) this.datosHistorial.fecha = cita.fecha;
  }

  public cerrarModal(): void {
    this.modal.nativeElement.close();
  }

  public guardar(formularioValido: boolean): void {
    this.error = '';
    if (!formularioValido) return;
    const datos = this.datosHistorial;
    if (!this.mascotaService.mascotas.some((mascota) => mascota.id === datos.mascotaId)) {
      this.error = 'Selecciona una mascota registrada.';
      return;
    }
    if (datos.fecha > this.hoy) {
      this.error = 'La atención no puede tener una fecha futura.';
      return;
    }
    if (datos.citaId !== null && !this.citasParaVincular.some((cita) => cita.id === datos.citaId)) {
      this.error = 'La cita no está disponible para esta atención.';
      return;
    }
    const cita = this.citaService.citas.find((cita) => cita.id === datos.citaId);
    if (cita && datos.fecha !== cita.fecha) {
      this.error = 'La fecha debe coincidir con la cita.';
      return;
    }
    const limpio = {
      ...datos,
      diagnostico: datos.diagnostico.trim(),
      tratamiento: datos.tratamiento.trim(),
      observaciones: datos.observaciones.trim(),
    };
    // Las atenciones se ordenan de la más reciente a la más antigua: la nueva queda al inicio.
    if (datos.id === 0) {
      this.historialService.registrar(limpio);
      this.pagina = 1;
    } else {
      this.historialService.actualizar(limpio);
    }
    if (cita) this.citaService.marcarAtendida(cita.id);
    this.cerrarModal();
    void Swal.fire({
      title: datos.id === 0 ? 'Atención registrada.' : 'Atención actualizada.',
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    });
  }

  public async eliminar(registro: DatosHistorial): Promise<void> {
    const respuesta = await Swal.fire({
      title: '¿Eliminar atención?',
      text: this.nombreMascota(registro.mascotaId),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      focusCancel: true,
      confirmButtonColor: '#d32f2f',
    });
    if (respuesta.isConfirmed) {
      this.historialService.eliminar(registro.id);
      this.pagina = Math.min(this.pagina, ultimaPagina(this.registros.length, this.porPagina));
      this.cdr.markForCheck();
      void Swal.fire({
        title: 'Atención eliminada.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    }
  }
}
