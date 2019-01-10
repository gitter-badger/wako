import { TraktApiService } from '../../services/trakt-api.service';
import { TraktShowWatchedDto } from '../../dtos/shows/trakt-show-watched.dto';

export class TraktShowsGetWatchedForm {
  static submit() {
    return TraktApiService.get<TraktShowWatchedDto[]>(`/users/me/watched/shows`, {
      extended: 'full'
    });
  }
}
