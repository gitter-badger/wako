import { TraktMoviesFilterStructure } from '../../services/trakt/sturctures/movies/trakt-movies-filter.structure';
import { Observable } from 'rxjs';
import { TraktMovieDto } from '../../services/trakt/dtos/movies/trakt-movie.dto';
import { map } from 'rxjs/operators';
import { TraktMovieToMovieQuery } from '../trakt/movie/trakt-movie-to-movie.query';
import { TraktMoviesSearchForm } from '../../services/trakt/forms/movies/trakt-movies-search.form';
import { TraktMoviesPopularForm } from '../../services/trakt/forms/movies/trakt-movies-popular.form';
import { Movie } from '../../entities/movie';
import { TraktMoviesPlayedForm } from '../../services/trakt/forms/movies/trakt-movies-played.form';
import { TraktMoviesTrendingForm } from '../../services/trakt/forms/movies/trakt-movies-trending.form';

export class SearchMoviesQuery {
  static getData(query: string, page: number, filters?: TraktMoviesFilterStructure) {
    let _obs: Observable<TraktMovieDto[]> = null;

    if (query.length === 0) {
      // _obs = TraktMoviesTrendingForm.submit(page, 20, filters);
      _obs = TraktMoviesPlayedForm.submit('weekly', page, 20, filters);
    } else if (query.length > 0 && !filters) {
      _obs = TraktMoviesSearchForm.submit(query, page, 20, filters);
    } else {
      _obs = TraktMoviesPopularForm.submit(query, page, 20, filters);
    }

    return _obs.pipe(
      map(traktMovies => {
        const movies: Movie[] = [];

        traktMovies.forEach(traktMovie => {
          movies.push(TraktMovieToMovieQuery.getData(traktMovie));
        });

        return movies;
      })
    );
  }
}
