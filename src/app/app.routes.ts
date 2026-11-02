import { Routes } from '@angular/router';
import { Dueno } from './dueno/components/dueno';
import { Mascota } from './mascota/components/mascota';
import { Cita } from './cita/components/cita';
import { Historial } from './historial/components/historial';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'duenos',
    pathMatch: 'full'
  },
  {
    path: 'duenos',
    component: Dueno
  },
  {
    path: 'mascotas',
    component: Mascota
  },
  {
    path: 'citas',
    component: Cita
  },
  {
    path: 'historial',
    component: Historial
  },
  {
    path: '**',
    redirectTo: 'duenos'
  }
];
