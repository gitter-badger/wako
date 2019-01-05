import { KodiHttpService } from '../../services/kodi-http.service';

export class KodiApplicationSetVolumeForm {
  static submit(volume: number) {
    return KodiHttpService.doAction<any>('Application.SetVolume', {
      volume: volume
    });
  }
}
