import { TraktMoviesGetByIdForm } from '../../services/trakt/forms/movies/trakt-movies-get-by-id.form';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TmdbMovieGetQuery } from '../tmdb/movie/tmdb-movie-get.query';
import { TraktMovieToMovieQuery } from '../trakt/movie/trakt-movie-to-movie.query';
import { of } from 'rxjs';

export class MovieGetByIdQuery {
  static getData(id: string | number) {
    return TraktMoviesGetByIdForm.submit(id).pipe(
      switchMap(traktMovie => {
        const movie = TraktMovieToMovieQuery.getData(traktMovie);

        return TmdbMovieGetQuery.getData(movie.tmdbId, movie.imdbId).pipe(
          map(tmdbMovie => {
            movie.images_url = {
              poster: tmdbMovie.poster,
              backdrop: tmdbMovie.backdrop
            };

            movie.alternative_titles = tmdbMovie.titles;

            return movie;
          }),
          catchError(() => {
            return of(movie);
          })
        );
      })
    );
  }
}
