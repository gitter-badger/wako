import { Component, Input } from '@angular/core';
import { Torrent } from '../../entities/torrent';
import { Platform, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { KodiPlayStopForm } from '../../services/kodi/forms/player/kodi-play-stop.form';
import { KodiPlayOpenForm } from '../../services/kodi/forms/player/kodi-play-open.form';
import { switchMap } from 'rxjs/operators';
import { KodiHttpService } from '../../services/kodi/services/kodi-http.service';

@Component({
  selector: 'wk-torrent-item',
  templateUrl: 'torrent-item.component.html',
  styleUrls: ['torrent-item.component.scss']
})
export class TorrentItemComponent {
  @Input()
  torrent: Torrent;

  constructor(private platform: Platform, private toastController: ToastController) {}

  private isWebPlatform() {
    return this.platform.is('cordova') === false;
  }

  download() {
    let obs = null;

    if (this.torrent.url instanceof Observable) {
      obs = this.torrent.url;
    } else {
      obs = of(this.torrent.url);
    }

    obs.subscribe(url => this._download(url, this.torrent.title));
  }

  private _download(url: string, title: string) {
    if (false && this.isWebPlatform()) {
      window.open(url, '_blank');
    } else {
      this.presentToast(`Start downloading ${title} on ${KodiHttpService.host.host}:${KodiHttpService.host.port}`);
      this.playTorrentOnKodi(url).subscribe(() => {
        console.log('has played');
        this.presentToast(`Torrent ${title} has started to play`);
      });
    }
  }

  private async presentToast(message: string) {
    this.toastController
      .create({
        message: message,
        duration: 4000,
        showCloseButton: true,
        position: 'top'
      })
      .then(toast => {
        toast.present();
      });
  }

  private playTorrentOnKodi(torrentUrl: string) {
    return KodiPlayStopForm.submit().pipe(
      switchMap(() => {
        return KodiPlayOpenForm.submit(`plugin://plugin.video.elementum/play?uri=${encodeURIComponent(torrentUrl)}`);
      })
    );
  }
}
