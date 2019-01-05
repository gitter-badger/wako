import { TraktApiService } from '../../services/trakt-api.service';
import { TraktShowDto } from '../../dtos/shows/trakt-show.dto';

export class TraktShowsGetByIdForm {
  static submit(id: string) {
    return TraktApiService.get<TraktShowDto>(`/shows/${id}`, {
      extended: 'full'
    });
  }
}
