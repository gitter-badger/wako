import { TraktApiService } from '../../services/trakt-api.service';
import { map } from 'rxjs/operators';
import { TraktMovieDto } from '../../dtos/movies/trakt-movie.dto';
import { Observable } from 'rxjs';

export class TraktMoviesGetWatchListForm {
  static submit(): Observable<TraktMovieDto[]> {
    return TraktApiService.get<{ movie: TraktMovieDto }[]>(`/sync/watchlist/movies`, {
      extended: 'full'
    }).pipe(
      map(data => {
        const movies: TraktMovieDto[] = [];

        data.forEach(d => {
          movies.push(d.movie);
        });

        return movies;
      })
    );
  }
}
