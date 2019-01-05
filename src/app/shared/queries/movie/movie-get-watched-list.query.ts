import { map } from 'rxjs/operators';
import { TraktMovieToMovieQuery } from '../trakt/movie/trakt-movie-to-movie.query';
import { TraktUsersGetWatchedForm } from '../../services/trakt/forms/users/trakt-users-get-watched.form';

export class MovieGetWatchedListQuery {
  static getData() {
    return TraktUsersGetWatchedForm.submit('movies').pipe(
      map(items => {
        return items.map(movie => TraktMovieToMovieQuery.getData(movie.movie));
      })
    );
  }
}
