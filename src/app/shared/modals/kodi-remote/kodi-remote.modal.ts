import { Component, OnDestroy, OnInit } from '@angular/core';
import { KodiService } from '../../services/app/kodi.service';
import { KodiApplicationSetVolumeForm } from '../../services/kodi/forms/application/kodi-application-set-volume.form';
import { KodiPropertiesStructure } from '../../services/kodi/structures/kodi-properties.structure';
import { Subscription } from 'rxjs';
import { KodiExcuteActionCommand } from '../../services/kodi/commands/kodi-excute-action.command';
import { KodiSeekToCommand } from '../../services/kodi/commands/kodi-seek-to.command';
import { ModalController } from '@ionic/angular';
import { KodiPlayerSetSubtitleForm } from '../../services/kodi/forms/player/kodi-player-set-subtitle.form';

@Component({
  templateUrl: 'kodi-remote.modal.html',
  styleUrls: ['./kodi-remote.modal.scss']
})
export class KodiRemoteModal implements OnInit, OnDestroy {
  kodiProperties: KodiPropertiesStructure = null;

  private kodiSubscription: Subscription;

  private timerSeek;

  thumbnail = null;

  constructor(private kodiService: KodiService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.setKodiProperties();
  }

  ngOnDestroy() {
    this.clearEvents();
    if (this.kodiSubscription) {
      this.kodiSubscription.unsubscribe();
    }
  }

  private clearEvents() {
    clearInterval(this.timerSeek);
  }

  private setKodiProperties() {
    this.kodiSubscription = this.kodiService.kodiProperties$.subscribe(properties => {
      this.kodiProperties = properties;

      this.clearEvents();

      this.thumbnail = null;

      if (this.kodiProperties.player) {
        this.timerSeek = setInterval(() => {
          if (this.kodiProperties.player.isPaused === false) {
            this.kodiProperties.player.media.currentSeconds++;
          }
        }, 1000);

        if (this.kodiProperties.player.media.thumbnail) {
          this.thumbnail = this.kodiProperties.player.media.thumbnail;
        }
      }
    });
  }

  setEnabledSubtitle() {
    this.kodiProperties.player.subtitleEnabled = !this.kodiProperties.player.subtitleEnabled;
    KodiPlayerSetSubtitleForm.submit(
      this.kodiProperties.player.id,
      this.kodiProperties.player.subtitleEnabled
    ).subscribe(() => {});
  }

  toggleOsd() {
    this.inputExecuteAction('osd');
  }

  setVolume(volume) {
    KodiApplicationSetVolumeForm.submit(volume).subscribe();
  }

  focusOnPlayerSeek() {
    this.clearEvents();
  }

  setPlayerSeek(event) {
    const value = event.target.value;

    KodiSeekToCommand.handle(value).subscribe();
  }

  inputExecuteAction(action) {
    return KodiExcuteActionCommand.handle(action).subscribe();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
