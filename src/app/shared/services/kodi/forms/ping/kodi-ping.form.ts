import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPingForm {
  static submit() {
    return KodiHttpService.doAction<string>('JSONRPC.Ping');
  }
}
