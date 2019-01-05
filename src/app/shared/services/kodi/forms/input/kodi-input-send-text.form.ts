import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiInputSendTextForm {
  static submit(text: string) {
    return KodiHttpService.doAction('Input.SendText', {
      text: text
    });
  }
}
