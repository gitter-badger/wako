import { TraktApiService } from '../../services/trakt-api.service';
import { TraktShowTrendingDto } from '../../dtos/shows/trakt-show-trending.dto';

export class TraktShowsGetTrendingForm {
  static submit(page: number, limit: number) {
    return TraktApiService.get<TraktShowTrendingDto[]>(
      `/shows/trending`,
      {
        extended: 'full',
        page: page,
        limit: limit
      },
      '1d'
    );
  }
}
