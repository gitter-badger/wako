import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiApplicationGetPropertiesForm {
  static submit(properties = ['volume', 'muted', 'version']) {
    return KodiHttpService.doAction<any>('Application.GetProperties', {
      properties: properties
    });
  }
}
