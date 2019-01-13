import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Settings } from '../../entities/settings';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings$ = new ReplaySubject<Settings>(1);

  constructor(private storage: Storage) {
    this.get();
  }

  get() {
    return this.storage
      .get('settings')
      .then(settings => {
        if (!settings) {
          return new Settings();
        }
        return settings as Settings;
      })
      .then(settings => {
        this.settings$.next(settings);
        return settings;
      });
  }

  set(settings: Settings) {
    return this.storage.set('settings', settings).then(() => {
      this.settings$.next(settings);
      return settings;
    });
  }
}
