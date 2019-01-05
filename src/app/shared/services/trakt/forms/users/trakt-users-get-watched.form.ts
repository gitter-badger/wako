import { TraktApiService } from '../../services/trakt-api.service';
import { TraktMovieDto } from '../../dtos/movies/trakt-movie.dto';
import { TraktShowDto } from '../../dtos/shows/trakt-show.dto';
import { map } from 'rxjs/operators';

export class TraktUsersGetWatchedForm {
  static submit(type: 'movies' | 'show') {
    return TraktApiService.get<{ last_watched_at: string; movie?: TraktMovieDto; show?: TraktShowDto }[]>(
      `/users/me/watched/${type}`,
      {
        extended: 'full'
      }
    ).pipe(
      map(items => {
        return items.sort((item1, item2) => {
          const d1 = new Date(item1.last_watched_at);
          const d2 = new Date(item2.last_watched_at);
          if (d1 > d2) {
            return -1;
          } else if (d1 < d2) {
            return 1;
          }
          return 0;
        });
      })
    );
  }
}
