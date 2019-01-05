import { TraktApiService } from '../../services/trakt-api.service';
import { TraktMovieDto } from '../../dtos/movies/trakt-movie.dto';
import { TraktMoviesFilterStructure } from '../../sturctures/movies/trakt-movies-filter.structure';
import { map } from 'rxjs/operators';

export class TraktMoviesTrendingForm {
  static submit(page: number, limit: number, filters?: TraktMoviesFilterStructure) {
    const params: any = {
      extended: 'full',
      page: page,
      limit: limit
    };

    if (filters) {
      if (filters.genre) {
        params.genres = filters.genre;
      }

      if (filters.rating) {
        params.ratings = +filters.rating * 10 + '-100';
      }

      if (filters.year) {
        params.years = filters.year;
      }
      if (filters.certification) {
        params.certifications = filters.certification;
      }
    }

    return TraktApiService.get<{ watchers: number; movie: TraktMovieDto }[]>(`/movies/trending`, params).pipe(
      map(results => {
        const traktMovies: TraktMovieDto[] = [];

        results.forEach(result => {
          traktMovies.push(result.movie);
        });

        return traktMovies;
      })
    );
  }
}
