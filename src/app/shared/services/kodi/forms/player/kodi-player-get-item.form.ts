import { KodiHttpService } from '../../services/kodi-http.service';
import { map } from 'rxjs/operators';

export class KodiPlayerGetItemForm {
  static submit<T>(playerId: number) {
    const properties = [
      'title',
      'thumbnail',
      'file',
      'artist',
      'genre',
      'year',
      'rating',
      'album',
      'track',
      'duration',
      'playcount',
      'dateadded',
      'episode',
      'artistid',
      'albumid',
      'tvshowid',
      'fanart'
    ];
    return KodiHttpService.doAction<{ item: T }>('Player.GetItem', {
      playerid: playerId,
      properties: properties
    }).pipe(map(d => d.item));
  }
}
