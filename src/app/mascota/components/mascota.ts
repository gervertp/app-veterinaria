import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { coincideBusqueda } from '../../shared/busqueda';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';
import { PaginarPipe, ultimaPagina } from '../../shared/paginar.pipe';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { DuenoService } from '../../dueno/dueno.service';
import { DatosMascota } from '../mascota.model';
import { MascotaService } from '../mascota.service';
import { CitaService } from '../../cita/cita.service';
import { HistorialService } from '../../historial/historial.service';
import { EdadPipe } from '../../shared/edad.pipe';

@Component({
  imports: [CommonModule, FormsModule, EdadPipe, PaginarPipe, Paginacion],
  selector: 'app-mascota',
  styleUrls: ['../../shared/styles/registros.css', './mascota.css'],
  templateUrl: './mascota.html',
})
export class Mascota {
  constructor(
    public duenoService: DuenoService,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef,
    private citaService: CitaService,
    private historialService: HistorialService,
  ) {}

  public busqueda = '';

  // Paginación: 5 registros por página.
  public pagina = 1;
  public porPagina = 5;

  public datosMascota: DatosMascota = {
    id: 0,
    nombre: '',
    especie: '',
    raza: '',
    edad: null,
    sexo: '',
    duenoId: null,
  };

  @ViewChild('formulario') formulario!: NgForm;

  public especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
  // Especie escrita a mano cuando se elige "Otro".
  public especieOtra = '';

  @ViewChild('modalMascota') modalMascota!: ElementRef<HTMLDialogElement>;

  public get mensajeVacio(): string {
    return this.busqueda.trim() ? 'No se encontraron coincidencias.' : 'No hay registros.';
  }

  public get mascotasFiltradas(): DatosMascota[] {
    return this.mascotas.filter((mascota) =>
      coincideBusqueda(
        this.busqueda,
        mascota.nombre,
        mascota.especie,
        mascota.raza,
        mascota.sexo,
        this.nombreDueno(mascota.duenoId),
      ),
    );
  }

  public get mascotas(): DatosMascota[] {
    return this.mascotaService.listar();
  }

  private crearFormulario(): DatosMascota {
    return { id: 0, nombre: '', especie: '', raza: '', edad: null, sexo: '', duenoId: null };
  }

  public nombreDueno(id: number | null): string {
    const dueno = this.duenoService.duenos.find((dueno) => dueno.id === id);
    return dueno ? dueno.nombres + ' ' + dueno.apellidos : 'Sin dueño';
  }

  public abrirRegistro(): void {
    if (this.duenoService.duenos.length === 0) {
      void Swal.fire({
        title: 'No hay dueños registrados',
        text: 'Registra un dueño para continuar.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7c4dff',
      });
      return;
    }
    this.datosMascota = this.crearFormulario();
    this.especieOtra = '';
    this.formulario.resetForm(this.datosMascota);
    this.modalMascota.nativeElement.showModal();
  }

  public editarMascota(mascota: DatosMascota): void {
    this.datosMascota = { ...mascota };
    this.especieOtra = '';
    // Si la especie no está en la lista, se edita como "Otro" con su texto.
    if (!this.especies.includes(mascota.especie)) {
      this.especieOtra = mascota.especie;
      this.datosMascota.especie = 'Otro';
    }
    this.formulario.resetForm(this.datosMascota);
    this.modalMascota.nativeElement.showModal();
  }

  public cerrarModal(): void {
    this.modalMascota.nativeElement.close();
  }

  public registrarMascota(formularioValido: boolean): void {
    if (!formularioValido) return;
    const existeDueno = this.duenoService.duenos.some(
      (dueno) => dueno.id === this.datosMascota.duenoId,
    );
    if (!existeDueno) return;

    const datos: DatosMascota = {
      ...this.datosMascota,
      nombre: this.datosMascota.nombre.trim(),
      raza: this.datosMascota.raza.trim(),
      especie:
        this.datosMascota.especie === 'Otro' ? this.especieOtra.trim() : this.datosMascota.especie,
    };
    let titulo = '';
    if (datos.id === 0) {
      this.mascotaService.registrar(datos);
      this.pagina = ultimaPagina(this.mascotasFiltradas.length, this.porPagina);
      titulo = 'Mascota registrada.';
    } else {
      this.mascotaService.actualizar(datos);
      titulo = 'Datos actualizados.';
    }
    this.cerrarModal();
    this.mostrarExito(titulo);
  }

  public async confirmarEliminacion(mascota: DatosMascota): Promise<void> {
    if (
      this.historialService.registrosHistorial.some((registro) => registro.mascotaId === mascota.id)
    ) {
      void Swal.fire({
        title: 'La mascota tiene historial de atención',
        text: 'No se puede eliminar mientras tenga atenciones registradas.',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    if (this.citaService.citas.some((cita) => cita.mascotaId === mascota.id)) {
      void Swal.fire({
        title: 'La mascota tiene citas registradas',
        text: 'Elimina sus citas antes de eliminar la mascota.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7c4dff',
      });
      return;
    }
    const respuesta = await Swal.fire({
      title: '¿Eliminar mascota?',
      text: mascota.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#76717e',
      focusCancel: true,
    });
    if (respuesta.isConfirmed) {
      this.mascotaService.eliminar(mascota.id);
      this.pagina = Math.min(this.pagina, ultimaPagina(this.mascotasFiltradas.length, this.porPagina));
      this.cdr.markForCheck();
      this.mostrarExito('Mascota eliminada.');
    }
  }

  private mostrarExito(titulo: string): void {
    void Swal.fire({ title: titulo, icon: 'success', timer: 1800, showConfirmButton: false });
  }
}
