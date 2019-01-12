import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../../shared/services/app/provider.service';
import { Provider } from '../../../../shared/entities/provider';
import { ModalController } from '@ionic/angular';
import { ProviderSetJsonComponent } from '../provider-set-json/provider-set-json.component';

@Component({
  selector: 'wk-provider-list',
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent implements OnInit {
  providersMap = new Map<string, Provider>();

  constructor(private providerService: ProviderService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.providerService.getMap().then(providers => {
      this.providersMap = providers;
    });
  }

  toggleProvider(key: string, enabled: boolean) {
    if (this.providersMap.has(key)) {
      this.providersMap.get(key).enabled = enabled;
      this.save();
    }
  }

  add() {
    this.modalCtrl
      .create({
        component: ProviderSetJsonComponent
      })
      .then(modal => {
        modal.present();
        modal.onDidDismiss().then(() => {
          this.getList();
        });
      });
  }

  delete(key: string) {
    if (this.providersMap.has(key)) {
      this.providersMap.delete(key);
      this.save();
    }
  }

  private save() {
    const providersWithKey: { [key: string]: Provider } = {};

    this.providersMap.forEach((provider, key) => {
      providersWithKey[key] = provider;
    });

    this.providerService.set(providersWithKey);
  }
}
