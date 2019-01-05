import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayerSetSeekForm {
  static submit(playerId: number, seek: number) {
    return KodiHttpService.doAction<any>('Player.Seek', {
      playerid: playerId,
      value: seek
    });
  }
}
