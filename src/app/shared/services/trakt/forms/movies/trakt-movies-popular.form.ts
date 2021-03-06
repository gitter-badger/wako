import { TraktApiService } from '../../services/trakt-api.service';
import { TraktMovieDto } from '../../dtos/movies/trakt-movie.dto';
import { TraktMoviesFilterStructure } from '../../sturctures/movies/trakt-movies-filter.structure';

export class TraktMoviesPopularForm {
  static submit(query: string, page: number, limit: number, filters?: TraktMoviesFilterStructure) {
    const params: any = {
      query: query,
      extended: 'full',
      page: page,
      limit: limit,
      movie: 'title'
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

    return TraktApiService.get<TraktMovieDto[]>(`/movies/popular`, params);
  }
}
