import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor(private router: Router) {}

  public menuCompacto = false;

  public get paginaActual(): string {
    const paginas: Record<string, string> = {
      duenos: 'Dueños', mascotas: 'Mascotas', citas: 'Citas', historial: 'Historial',
    };
    return paginas[this.router.url.split('/')[1]?.split('?')[0]] ?? 'Dueños';
  }
}
