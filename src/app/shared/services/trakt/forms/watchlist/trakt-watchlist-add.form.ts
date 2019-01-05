import { TraktApiService } from '../../services/trakt-api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class TraktWatchlistAddForm {
  static submit(imdbId: string): Observable<boolean> {
    return TraktApiService.post<any>(`/sync/watchlist`, {
      movies: [
        {
          ids: {
            imdb: imdbId
          }
        }
      ]
    }).pipe(
      map(data => {
        return data.added.movies === 1;
      })
    );
  }
}
