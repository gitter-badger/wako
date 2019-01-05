import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiGuiGetPropertiesForm {
  static submit(properties = ['fullscreen']) {
    return KodiHttpService.doAction('GUI.GetProperties', {
      properties: properties
    });
  }
}
