// Clase base de los servicios: cada registro debe tener un id.
export abstract class CrudService<T extends { id: number }> {
  protected registros: T[];
  private siguienteId: number;

  // Recibe los datos de prueba de cada servicio (simulación de base de datos).
  constructor(datosIniciales: T[] = []) {
    this.registros = datosIniciales;
    this.siguienteId = Math.max(0, ...datosIniciales.map((registro) => registro.id)) + 1;
  }

  public listar(): T[] {
    return this.registros;
  }

  public registrar(datos: T): void {
    const nuevoRegistro: T = { ...datos, id: this.siguienteId };
    this.registros.push(nuevoRegistro);
    this.siguienteId++;
  }

  public actualizar(datos: T): void {
    const indice = this.registros.findIndex((registro) => registro.id === datos.id);
    if (indice === -1) return;
    this.registros[indice] = { ...datos };
  }

  public eliminar(id: number): void {
    const indice = this.registros.findIndex((registro) => registro.id === id);
    if (indice === -1) return;
    this.registros.splice(indice, 1);
  }
}
