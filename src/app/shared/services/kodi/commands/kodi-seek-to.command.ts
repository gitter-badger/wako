import { switchMap } from 'rxjs/operators';
import { KodiPlayerSetSeekForm } from '../forms/player/kodi-player-set-seek.form';
import { KodiGetPropertiesQuery } from '../queries/kodi-get-properties.query';

export class KodiSeekToCommand {
  static handle(seekToInSeconds: number) {
    return KodiGetPropertiesQuery.submit().pipe(
      switchMap(kodiProperties => {
        const seek = Math.round((seekToInSeconds / kodiProperties.player.media.totalSeconds) * 100);

        return KodiPlayerSetSeekForm.submit(kodiProperties.player.id, seek);
      })
    );
  }
}
