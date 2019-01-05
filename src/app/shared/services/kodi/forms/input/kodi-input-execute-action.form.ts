import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiInputExecuteActionForm {
  static submit(action: string) {
    return KodiHttpService.doAction('Input.ExecuteAction', {
      action: action
    });
  }
}
