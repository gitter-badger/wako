import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiPlayOpenForm {
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
