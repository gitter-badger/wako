import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayStopForm {
  static submit() {
    return KodiHttpService.doAction<any>('Player.Stop');
  }
}
