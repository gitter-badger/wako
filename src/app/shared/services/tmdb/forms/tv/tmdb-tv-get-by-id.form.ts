import { TmdbApiService } from '../../services/tmdb-api.service';
import { TmdbTvDto } from '../../dtos/tv/tmdb-tv.dto';

export class TmdbTvGetByIdForm {
  static submit(tmdbId: number) {
    return TmdbApiService.get<TmdbTvDto>(`/tv/${tmdbId}`, null, '1m');
  }
}
