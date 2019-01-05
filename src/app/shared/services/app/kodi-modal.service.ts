import { Injectable } from '@angular/core';
import { KodiRemoteModal } from '../../modals/kodi-remote/kodi-remote.modal';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class KodiModalService {
  private modal;

  modalOpened = false;

  constructor(private modalCtrl: ModalController) {}

  toggleRemoteModal() {
    console.log('toggleRemoteModal', this.modal);
    if (this.modal) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.modal) {
      return;
    }

    this.modalCtrl
      .create({
        component: KodiRemoteModal,
        componentProps: {
          modal: this.modal
        }
      })
      .then(modal => {
        this.modalOpened = true;
        this.modal = modal;
        this.modal.present();

        this.modal.onDidDismiss().then(() => {
          this.modalOpened = false;
          this.modal = null;
        });
      });
  }

  close() {
    if (this.modal) {
      this.modal.dismiss();
    }
  }
}
