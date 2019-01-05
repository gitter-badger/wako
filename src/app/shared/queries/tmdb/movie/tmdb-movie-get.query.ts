import { TmdbMovieGetByIdForm } from '../../../services/tmdb/forms/movie/tmdb-movie-get-by-id.form';
import { TmdbFindForm } from '../../../services/tmdb/forms/find/tmdb-find.form';
import { map } from 'rxjs/operators';

export class TmdbMovieGetQuery {
  private static getMovie(tmdbId: number, imdbId: string) {
    if (tmdbId) {
      return TmdbMovieGetByIdForm.submit(tmdbId);
    }

    return TmdbFindForm.submit(imdbId).pipe(
      map(result => {
        if (!result.movie_results.length) {
          return null;
        }

        return result.movie_results
          .filter(_movie => {
            if (_movie) {
              _movie.imdb_id = imdbId;
            }

            return _movie;
          })
          .pop();
      })
    );
  }

  private static getImageFromPath(path: string, size: number) {
    return `https://image.tmdb.org/t/p/w${size}${path}`;
  }

  static getData(tmdbId: number, imdbId: string) {
    return this.getMovie(tmdbId, imdbId).pipe(
      map(m => {
        if (!m) {
          return <TmdbMovie>{
            poster: 'assets/imgs/item-not-found.png',
            backdrop: ''
          };
        }

        const titles = {};
        if (m.translations) {
          m.translations.translations.forEach(translation => {
            titles[translation.iso_3166_1.toLowerCase()] =
              translation.data.title.length > 0 ? translation.data.title : m.title;
          });
        }

        return <TmdbMovie>{
          poster: this.getImageFromPath(m.poster_path, 300),
          backdrop: this.getImageFromPath(m.backdrop_path, 500),
          titles: titles
        };
      })
    );
  }
}

export interface TmdbMovie {
  poster: string;
  backdrop: string;
  titles?: { [key: string]: string };
}
