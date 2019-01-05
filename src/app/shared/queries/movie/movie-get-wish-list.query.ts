import { TraktMoviesGetWatchListForm } from '../../services/trakt/forms/movies/trakt-movies-get-watch-list.form';
import { map } from 'rxjs/operators';
import { TraktMovieToMovieQuery } from '../trakt/movie/trakt-movie-to-movie.query';

export class MovieGetWishListQuery {
  static getData() {
    return TraktMoviesGetWatchListForm.submit().pipe(
      map(movies => {
        return movies.map(movie => TraktMovieToMovieQuery.getData(movie));
      })
    );
  }
}
