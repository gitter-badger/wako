import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayerSetSubtitleForm {
  static submit(playerId: number, enabled: boolean) {
    return KodiHttpService.doAction<any>('Player.SetSubtitle', {
      playerid: playerId,
      subtitle: enabled ? 'on' : 'off',
      enable: enabled
    });
  }
}
