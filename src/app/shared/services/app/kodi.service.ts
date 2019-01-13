import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../environments/environment';
import { KodiHostStructure } from '../kodi/structures/kodi-host.structure';
import { KodiPropertiesStructure } from '../kodi/structures/kodi-properties.structure';
import { AlertController, Platform } from '@ionic/angular';
import { KodiWsService } from '../kodi/services/kodi-ws.service';
import { KodiHttpService } from '../kodi/services/kodi-http.service';
import { KodiGetPropertiesQuery } from '../kodi/queries/kodi-get-properties.query';
import { ReplaySubject, Subscription } from 'rxjs';

import { KodiInputSendTextForm } from '../kodi/forms/input/kodi-input-send-text.form';

@Injectable({
  providedIn: 'root'
})
export class KodiService {
  kodiProperties$ = new ReplaySubject<KodiPropertiesStructure>(1);

  currentHost: KodiHostStructure;

  isConnectedToHost = false;

  private timerNewMessage;

  private kodiSubscription: Subscription;

  private prompt;

  constructor(private storage: Storage, private platform: Platform, private alertController: AlertController) {
    if (this.platform.is('cordova')) {
      this.platform.resume.subscribe(() => {
        console.log('Resume');
        this.connectToDefaultHost();
      });
    }

    this.connectToDefaultHost();

    KodiWsService.connected$.subscribe(connected => {
      this.isConnectedToHost = connected;
    });
  }

  connectToDefaultHost() {
    this.getCurrentHost().then(host => {
      this.disconnect();

      if (!host) {
        return;
      }
      this.currentHost = host;

      this.connect();
    });
  }

  private unsubscribeEvents() {
    if (this.kodiSubscription) {
      this.kodiSubscription.unsubscribe();
    }

    clearTimeout(this.timerNewMessage);
  }

  private connect() {
    KodiWsService.connect(this.currentHost);
    KodiHttpService.setHost(this.currentHost);

    this.kodiSubscription = KodiWsService.wsMessage$.subscribe(data => {
      // TODO do better
      switch (data.method) {
        case 'Input.OnInputRequested':
          this.showPrompt(data.params.data.title, data.params.data.value);
          break;

        case 'Input.OnInputFinished':
          this.closePrompt();
          break;
        default:
          if (this.timerNewMessage) {
            clearTimeout(this.timerNewMessage);
          }
          this.timerNewMessage = setTimeout(() => {
            console.log('FROM HERE');
            this.setKodiProperties();
          }, 0);
      }
    });

    this.setKodiProperties();
  }

  private async showPrompt(title: string, value: string) {
    this.prompt = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'input',
          type: 'text',
          placeholder: title,
          value: value
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('Confirm Ok', data);
            KodiInputSendTextForm.submit(data.input).subscribe();
          }
        }
      ]
    });

    await this.prompt.present();
  }

  private closePrompt() {
    if (this.prompt) {
      this.prompt.dismiss();
      this.prompt = null;
    }
  }

  private setKodiProperties() {
    KodiGetPropertiesQuery.submit().subscribe(properties => {
      console.log('setProperties', { properties });

      this.kodiProperties$.next(properties);
    });
  }

  private disconnect() {
    this.unsubscribeEvents();

    KodiWsService.disconnect();
  }

  getHosts(): Promise<KodiHostStructure[]> {
    return this.storage.get(environment.kodi.storageHostsKey).then(hosts => {
      return hosts || [];
    });
  }

  private setHosts(hosts: KodiHostStructure[]): Promise<boolean> {
    return this.getCurrentHost().then(currentHost => {
      let currentHostExists = false;

      if (currentHost) {
        hosts.forEach(host => {
          if (this.areHostEqual(host, currentHost)) {
            currentHostExists = true;
          }
        });
      }

      return this.storage.set(environment.kodi.storageHostsKey, hosts).then(() => {
        if (!currentHostExists) {
          return this.setCurrentHost(hosts.length ? hosts[0] : null).then(() => true);
        }
        return true;
      });
    });
  }

  private areHostEqual(host1: KodiHostStructure, host2: KodiHostStructure) {
    return host1.host === host2.host || +host1.port === +host2.port;
  }

  getCurrentHost(): Promise<KodiHostStructure> {
    return this.storage.get(environment.kodi.storageCurrentHostKey);
  }

  setCurrentHost(host: KodiHostStructure): Promise<KodiHostStructure> {
    return this.storage.set(environment.kodi.storageCurrentHostKey, host).then(d => {
      this.connectToDefaultHost();
      return d;
    });
  }

  removeHost(host: KodiHostStructure): Promise<any> {
    return this.getHosts().then(hosts => {
      const newHosts = [];
      hosts.forEach(_host => {
        if (!this.areHostEqual(_host, host)) {
          newHosts.push(_host);
        }
      });

      return this.setHosts(newHosts);
    });
  }

  addHost(host: KodiHostStructure): Promise<any> {
    return this.getHosts().then(hosts => {
      let exists = false;
      hosts.forEach(_host => {
        if (_host.host === host.host && _host.port === host.port) {
          exists = true;
        }
      });

      if (!exists) {
        hosts.push(host);
      }

      return this.setHosts(hosts);
    });
  }
}
