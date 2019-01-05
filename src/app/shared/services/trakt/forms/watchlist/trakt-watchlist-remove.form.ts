import { TraktApiService } from '../../services/trakt-api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class TraktWatchlistRemoveForm {
  static submit(imdbId: string): Observable<boolean> {
    return TraktApiService.post<any>(`/sync/watchlist/remove`, {
      movies: [
        {
          ids: {
            imdb: imdbId
          }
        }
      ]
    }).pipe(
      map(data => {
        return data.deleted.movies === 1;
      })
    );
  }
}
