import { TraktMovieDto } from '../../../services/trakt/dtos/movies/trakt-movie.dto';
import { Movie } from '../../../entities/movie';

export class TraktMovieToMovieQuery {
  static getData(traktMovie: TraktMovieDto) {
    if (!traktMovie) {
      return null;
    }

    const movie = new Movie();

    movie.title = traktMovie.title;
    movie.year = traktMovie.year;
    movie.imdbId = traktMovie.ids.imdb;
    movie.tmdbId = traktMovie.ids.tmdb;
    movie.traktId = traktMovie.ids.trakt;

    movie.certification = traktMovie.certification;

    movie.tagline = traktMovie.tagline;
    movie.overview = traktMovie.overview;
    movie.released = traktMovie.released;
    movie.runtime = traktMovie.runtime;
    movie.rating = traktMovie.rating;
    movie.votes = traktMovie.votes;
    movie.language = traktMovie.language;
    movie.genres = traktMovie.genres;

    movie.images_url = {
      poster: null,
      backdrop: null
    };

    movie.isDataComplete = false;

    return movie;
  }
}
