import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { KodiService } from '../../../../shared/services/app/kodi.service';
import { KodiHostStructure } from '../../../../shared/services/kodi/structures/kodi-host.structure';
import { KodiHttpService } from '../../../../shared/services/kodi/services/kodi-http.service';
import { KodiPingForm } from '../../../../shared/services/kodi/forms/ping/kodi-ping.form';
import { ModalController } from '@ionic/angular';

@Component({
  templateUrl: 'kodi-settings-page.component.html'
})
export class KodiSettingsPageComponent implements OnInit {
  form: FormGroup;

  settingsOk = false;

  private isConfigOkSubscription: Subscription;
  private checkSettingsSubject = new Subject<KodiHostStructure>();

  currentHost: KodiHostStructure;

  constructor(private kodiService: KodiService, private formBuilder: FormBuilder, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.init(this.currentHost);
  }

  private init(host: KodiHostStructure) {
    if (!host) {
      host = {
        host: '',
        port: 80,
        wsPort: 9090,
        login: '',
        password: ''
      };
    }

    this.form = this.formBuilder.group(host as any);

    this.form.valueChanges.subscribe(data => {
      this.checkSettings(data);
    });

    this.checkSettingsSubject
      .pipe(
        debounceTime(300), // wait 300ms after each keystroke before considering the term
        distinctUntilChanged(), // ignore if next search term is same as previous
        map(config => {
          if (!config) {
            return of(false);
          }

          KodiHttpService.setHost(config);

          return KodiPingForm.submit();
        })
      )
      .subscribe((observer: Observable<string>) => {
        if (this.isConfigOkSubscription) {
          this.isConfigOkSubscription.unsubscribe();
        }

        this.isConfigOkSubscription = observer.subscribe(data => (this.settingsOk = data === 'pong'));
      });

    this.checkSettings(host);
  }

  private checkSettings(config) {
    if (config.host.length && config.port > 0) {
      this.checkSettingsSubject.next(config);
    }
  }

  private addHostAndNavBack() {
    this.kodiService.addHost(this.form.value).then(() => this.modalCtrl.dismiss());
  }

  processForm() {
    if (this.currentHost) {
      this.kodiService.removeHost(this.currentHost).then(() => this.addHostAndNavBack());
    } else {
      this.addHostAndNavBack();
    }
  }
}
