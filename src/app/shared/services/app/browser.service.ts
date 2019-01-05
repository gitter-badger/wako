import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {
  constructor(private platform: Platform, private iab: InAppBrowser) {}

  open(url: string) {
    if (this.platform.is('android')) {
      this.iab.create(url, '_blank', 'location=yes');
    } else {
      window.open(url, '_system', 'location=yes');
    }
  }
}
