import { TmdbApiService } from '../../services/tmdb-api.service';
import { TmdbMovieDto } from '../../dtos/movie/tmdb-movie.dto';

export class TmdbFindForm {
  static submit(search: string, external_source = 'imdb_id') {
    return TmdbApiService.get<{ movie_results: TmdbMovieDto[] }>(
      `/find/${search}`,
      {
        external_source: external_source
      },
      '1m'
    );
  }
}
