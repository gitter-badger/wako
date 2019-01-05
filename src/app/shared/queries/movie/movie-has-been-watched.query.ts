import { TraktMoviesGetWatchedForm } from '../../services/trakt/forms/movies/trakt-movies-get-watched.form';
import { map } from 'rxjs/operators';

export class MovieHasBeenWatchedQuery {
  static getData(imdbId: string) {
    return TraktMoviesGetWatchedForm.submit().pipe(
      map(dtos => {
        let hasBeenWatched = false;
        dtos.forEach(dto => {
          if (imdbId === dto.movie.ids.imdb) {
            hasBeenWatched = true;
          }
        });

        return hasBeenWatched;
      })
    );
  }
}
