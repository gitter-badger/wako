import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorToastService {
  constructor(private toastCtrl: ToastController) {}

  create(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .then(toast => toast.present());
  }
}
