import { KodiApplicationGetPropertiesForm } from '../forms/application/kodi-application-get-properties.form';
import { map, switchMap } from 'rxjs/operators';
import { KodiPropertiesStructure } from '../structures/kodi-properties.structure';
import { KodiPlayerGetAllActiveForm } from '../forms/player/kodi-player-get-all-active.form';
import { of } from 'rxjs';
import { KodiPlayerGetPropertiesForm } from '../forms/player/kodi-player-get-properties.form';
import { KodiPlayerGetItemForm } from '../forms/player/kodi-player-get-item.form';
import { KodiHttpService } from '../services/kodi-http.service';

export class KodiGetPropertiesQuery {
  static getTotalSeconds(hours: number, minutes: number, seconds: number) {
    return hours * 60 * 60 + minutes * 60 + seconds;
  }

  static submit() {
    return KodiApplicationGetPropertiesForm.submit().pipe(
      switchMap(data => {
        const kodiProperties: KodiPropertiesStructure = {
          host: KodiHttpService.host,
          app: {
            volume: data.volume,
            muted: data.muted
          },
          player: {
            id: null,
            isPlaying: false,
            isPaused: false,
            subtitleEnabled: false,
            media: {
              label: 'Unknown',
              thumbnail: null,
              totalSeconds: 0,
              currentSeconds: 0
            }
          }
        };

        return KodiPlayerGetAllActiveForm.submit().pipe(
          switchMap(players => {
            if (!players.length) {
              return of(kodiProperties);
            }

            kodiProperties.player.id = players.pop().playerid;

            return KodiPlayerGetPropertiesForm.submit(kodiProperties.player.id).pipe(
              switchMap(properties => {
                kodiProperties.player.isPlaying = true;
                kodiProperties.player.isPaused = properties.speed === 0;
                kodiProperties.player.subtitleEnabled = properties.subtitleenabled;
                kodiProperties.player.media.totalSeconds = this.getTotalSeconds(
                  properties.totaltime.hours,
                  properties.totaltime.minutes,
                  properties.totaltime.seconds
                );

                kodiProperties.player.media.currentSeconds = this.getTotalSeconds(
                  properties.time.hours,
                  properties.time.minutes,
                  properties.time.seconds
                );

                return KodiPlayerGetItemForm.submit<{ label: string; thumbnail: string }>(
                  kodiProperties.player.id
                ).pipe(
                  map(item => {
                    kodiProperties.player.media.label = item.label;
                    if (item.thumbnail) {
                      kodiProperties.player.media.thumbnail = `http://${KodiHttpService.host.host}:${
                        KodiHttpService.host.port
                      }/image/${encodeURIComponent(item.thumbnail)}`;
                    }
                    return kodiProperties;
                  })
                );
              })
            );
          })
        );
      })
    );
  }
}
