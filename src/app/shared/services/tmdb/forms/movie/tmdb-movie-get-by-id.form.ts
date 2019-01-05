import { TmdbApiService } from '../../services/tmdb-api.service';
import { TmdbMovieDto } from '../../dtos/movie/tmdb-movie.dto';

export class TmdbMovieGetByIdForm {
  static submit(tmdbId: number) {
    return TmdbApiService.get<TmdbMovieDto>(
      `/movie/${tmdbId}`,
      {
        append_to_response: 'translations'
      },
      '1m'
    );
  }
}
