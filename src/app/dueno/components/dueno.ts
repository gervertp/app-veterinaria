import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { coincideBusqueda } from '../../shared/busqueda';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

import { PaginarPipe, ultimaPagina } from '../../shared/paginar.pipe';
import { Paginacion } from '../../shared/paginacion/paginacion';

import { DatosDueno } from '../dueno.model';
import { DuenoService } from '../dueno.service';
import { MascotaService } from '../../mascota/mascota.service';

@Component({
  imports: [CommonModule, FormsModule, PaginarPipe, Paginacion],
  selector: 'app-dueno',
  styleUrls: ['../../shared/styles/registros.css', './dueno.css'],
  templateUrl: './dueno.html',
})
export class Dueno {
  constructor(
    private cdr: ChangeDetectorRef,
    private duenoService: DuenoService,
    private mascotaService: MascotaService,
  ) {}

  public get mensajeVacio(): string {
    return this.busqueda.trim() ? 'No se encontraron coincidencias.' : 'No hay registros.';
  }

  public get duenosFiltrados(): DatosDueno[] {
    return this.duenos.filter((dueno) =>
      coincideBusqueda(
        this.busqueda,
        dueno.nombres,
        dueno.apellidos,
        dueno.dni,
        dueno.telefono,
        dueno.correo,
      ),
    );
  }

  public get duenos(): DatosDueno[] {
    return this.duenoService.listar();
  }

  // ngModel conecta este objeto con los campos del formulario.
  public busqueda = '';

  // Paginación: 5 registros por página.
  public pagina = 1;
  public porPagina = 5;

  public datosDueno: DatosDueno = {
    id: 0,
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    correo: '',
  };

  @ViewChild('formulario') formulario!: NgForm;

  public error = '';

  @ViewChild('modalDueno') modalDueno!: ElementRef<HTMLDialogElement>;

  public abrirRegistro(): void {
    this.error = '';
    this.limpiarFormulario();
    this.modalDueno.nativeElement.showModal();
  }

  public editarDueno(dueno: DatosDueno): void {
    this.error = '';
    this.datosDueno = { ...dueno };
    this.formulario.resetForm(this.datosDueno);
    this.modalDueno.nativeElement.showModal();
  }

  public cerrarModal(): void {
    this.modalDueno.nativeElement.close();
  }

  public async confirmarEliminacion(dueno: DatosDueno): Promise<void> {
    if (this.mascotaService.mascotas.some((mascota) => mascota.duenoId === dueno.id)) {
      void Swal.fire({
        title: 'El dueño tiene mascotas registradas',
        text: 'Cambia el dueño de esas mascotas antes de eliminarlo.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7c4dff',
      });
      return;
    }
    const respuesta = await Swal.fire({
      title: '¿Eliminar dueño?',
      text: dueno.nombres + ' ' + dueno.apellidos,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#76717e',
      focusCancel: true,
    });

    if (respuesta.isConfirmed) {
      this.duenoService.eliminar(dueno.id);
      this.pagina = Math.min(this.pagina, ultimaPagina(this.duenosFiltrados.length, this.porPagina));
      this.cdr.markForCheck();
      this.mostrarExito('Dueño eliminado.');
    }
  }

  private mostrarExito(titulo: string): void {
    void Swal.fire({
      title: titulo,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    });
  }

  public registrarDueno(formularioValido: boolean): void {
    this.error = '';
    if (!formularioValido) return;

    if (
      this.duenos.some(
        (dueno) => dueno.dni === this.datosDueno.dni && dueno.id !== this.datosDueno.id,
      )
    ) {
      this.error = 'Ya existe un dueño con ese DNI.';
      return;
    }
    Object.assign(this.datosDueno, {
      nombres: this.datosDueno.nombres.trim(),
      apellidos: this.datosDueno.apellidos.trim(),
      correo: this.datosDueno.correo.trim(),
    });
    let titulo = '';
    // Guardamos una copia para que el siguiente registro no cambie el anterior.
    if (this.datosDueno.id === 0) {
      this.duenoService.registrar(this.datosDueno);
      this.pagina = ultimaPagina(this.duenosFiltrados.length, this.porPagina);
      titulo = 'Dueño registrado.';
    } else {
      this.duenoService.actualizar(this.datosDueno);
      titulo = 'Datos actualizados.';
    }
    this.cerrarModal();
    this.limpiarFormulario();
    this.mostrarExito(titulo);
  }

  public limpiarFormulario(): void {
    this.datosDueno = { id: 0, nombres: '', apellidos: '', dni: '', telefono: '', correo: '' };
    this.formulario.resetForm(this.datosDueno);
  }
}
