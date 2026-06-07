import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cash, musicalNotes, bagHandle, car, storefront, shieldCheckmark,
  flag, documentText, flame, restaurant, ticket, receipt, swapHorizontal,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    // Iconos de categoría/notificación que se resuelven dinámicamente desde los
    // datos (DataService). Se registran una sola vez, disponibles en toda la app.
    addIcons({
      cash, musicalNotes, bagHandle, car, storefront, shieldCheckmark,
      flag, documentText, flame, restaurant, ticket, receipt, swapHorizontal,
    });
  }
}
