import { Component, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonButton, IonList, IonItem, IonLabel, IonIcon, IonNote,
} from '@ionic/angular/standalone';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonButton, IonList, IonItem, IonLabel, IonIcon, IonNote,
  ],
})
export class NotificationsPage {
  data = inject(DataService);

  markAllRead(): void {
    this.data.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }
}
