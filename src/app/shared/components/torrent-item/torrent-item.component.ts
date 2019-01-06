import { Component, Input } from '@angular/core';
import { Torrent } from '../../entities/torrent';
import { Platform, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { KodiPlayerStopForm } from '../../services/kodi/forms/player/kodi-player-stop.form';
import { KodiPlayerOpenForm } from '../../services/kodi/forms/player/kodi-player-open.form';
import { switchMap } from 'rxjs/operators';
import { KodiHttpService } from '../../services/kodi/services/kodi-http.service';
import { KodiService } from '../../services/app/kodi.service';
import { ElementumQueryParam } from '../../entities/elementum-query-param';

@Component({
  selector: 'wk-torrent-item',
  templateUrl: 'torrent-item.component.html',
  styleUrls: ['torrent-item.component.scss']
})
export class TorrentItemComponent {
  @Input()
  torrent: Torrent;

  @Input()
  elementumQueryParam: ElementumQueryParam;

  constructor(private platform: Platform, private toastController: ToastController, private kodiService: KodiService) {}

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
    if (this.isWebPlatform()) {
      window.open(url, '_blank');
    } else {
      this.kodiService.getCurrentHost().then(currentHost => {
        if (!currentHost) {
          this.toastController
            .create({
              message: `No host set for kodi`,
              duration: 4000,
              showCloseButton: true,
              position: 'bottom'
            })
            .then(toast => {
              toast.present();
            });
          return;
        }
        this.presentToast(`Start downloading ${title} on ${KodiHttpService.host.host}:${KodiHttpService.host.port}`);
        this.playTorrentOnKodi(url).subscribe(() => {
          console.log('has played');
          this.presentToast(`Torrent ${title} has started to play`);
        });
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
    return KodiPlayerStopForm.submit().pipe(
      switchMap(() => {
        let url = `plugin://plugin.video.elementum/play?uri=${encodeURIComponent(torrentUrl)}`;
        if (this.elementumQueryParam.category) {
          url += '&type=' + this.elementumQueryParam.category;
        }
        if (this.elementumQueryParam.tmdbId) {
          url += '&tmdb=' + this.elementumQueryParam.tmdbId;
        }
        if (this.elementumQueryParam.tmdbShowId) {
          url += '&show=' + this.elementumQueryParam.tmdbShowId;
        }
        if (this.elementumQueryParam.seasonNumber) {
          url += '&season=' + this.elementumQueryParam.seasonNumber;
        }
        if (this.elementumQueryParam.episodeNumber) {
          url += '&episode=' + this.elementumQueryParam.episodeNumber;
        }
        if (this.elementumQueryParam.query) {
          url += '&query=' + encodeURIComponent(this.elementumQueryParam.query);
        }
        return KodiPlayerOpenForm.submit(url);
      })
    );
  }
}
