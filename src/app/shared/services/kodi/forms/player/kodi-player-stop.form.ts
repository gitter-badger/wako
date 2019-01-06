import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayerStopForm {
  static submit() {
    return KodiHttpService.doAction<any>('Player.Stop');
  }
}
