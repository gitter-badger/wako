import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayerGetPropertiesForm {
  static submit(
    playerId: number,
    properties = ['playlistid', 'speed', 'position', 'totaltime', 'time', 'subtitleenabled']
  ) {
    return KodiHttpService.doAction<any>('Player.GetProperties', {
      playerid: playerId,
      properties: properties
    });
  }
}
