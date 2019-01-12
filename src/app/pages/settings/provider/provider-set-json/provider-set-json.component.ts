import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../../shared/services/app/provider.service';
import { Router } from '@angular/router';
import { Provider } from '../../../../shared/entities/provider';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'wk-provider-set-json',
  templateUrl: './provider-set-json.component.html',
  styleUrls: ['./provider-set-json.component.scss']
})
export class ProviderSetJsonComponent implements OnInit {
  code = '';

  constructor(private providerService: ProviderService, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.providerService.getMap().then(providers => {
      const providersWithKey: { [key: string]: Provider } = {};

      providers.forEach((provider, key) => {
        providersWithKey[key] = provider;
      });

      this.code = JSON.stringify(providersWithKey, null, 4);
    });
  }

  save() {
    try {
      const json = JSON.parse(this.code);

      this.providerService
        .set(json)
        .then(() => {
          this.modalCtrl.dismiss();
        })
        .catch(err => {
          alert(err.message);
        });
    } catch (e) {
      alert(e.toString());
    }
  }
}
