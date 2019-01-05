import { Component, OnDestroy, OnInit } from '@angular/core';
import { KodiService } from '../../services/app/kodi.service';
import { KodiPropertiesStructure } from '../../services/kodi/structures/kodi-properties.structure';
import { Subscription } from 'rxjs';
import { KodiExcuteActionCommand } from '../../services/kodi/commands/kodi-excute-action.command';
import { KodiPlayerSetSubtitleForm } from '../../services/kodi/forms/player/kodi-player-set-subtitle.form';
import { KodiModalService } from '../../services/app/kodi-modal.service';

@Component({
  selector: 'wk-kodi-remote-toolbar',
  templateUrl: './kodi-remote-toolbar.component.html',
  styleUrls: ['./kodi-remote-toolbar.component.scss']
})
export class KodiRemoteToolbarComponent implements OnInit, OnDestroy {
  kodiProperties: KodiPropertiesStructure = null;

  private kodiSubscription: Subscription;

  constructor(public kodiService: KodiService, public kodiModalService: KodiModalService) {}

  ngOnInit() {
    this.setKodiProperties();
  }

  ngOnDestroy() {
    if (this.kodiSubscription) {
      this.kodiSubscription.unsubscribe();
    }
  }

  private setKodiProperties() {
    this.kodiSubscription = this.kodiService.kodiProperties$.subscribe(properties => {
      this.kodiProperties = properties;
    });
  }

  inputExecuteAction(action) {
    return KodiExcuteActionCommand.handle(action).subscribe();
  }

  toggleOsd() {
    this.inputExecuteAction('osd');

    this.kodiModalService.open();
  }
}
