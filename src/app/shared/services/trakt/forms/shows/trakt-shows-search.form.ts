import { TraktApiService } from '../../services/trakt-api.service';
import { TraktShowDto } from '../../dtos/shows/trakt-show.dto';

export class TraktShowsSearchForm {
  static submit(query: string, page: number) {
    return TraktApiService.get<{ show: TraktShowDto }[]>(
      `/search/show`,
      {
        query: query,
        extended: 'full',
        page: page
      },
      '1m'
    );
  }
}
