import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayerGetAllActiveForm {
  static submit() {
    console.log('Player.GetActivePlayers');
    return KodiHttpService.doAction<{ playerid: number }[]>('Player.GetActivePlayers');
  }
}
