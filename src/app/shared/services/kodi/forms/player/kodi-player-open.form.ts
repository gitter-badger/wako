import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayerOpenForm {
  static submit(fileUrl: string) {
    return KodiHttpService.doAction<any>(
      'Player.Open',
      {
        item: {
          file: fileUrl
        }
      },
      20000
    );
  }
}
