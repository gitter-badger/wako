import { TraktApiService } from '../../services/trakt-api.service';
import { TraktShowNextEpisodeDto } from '../../dtos/shows/trakt-show-next-episode.dto';
import { map } from 'rxjs/operators';

export class TraktShowsGetNextEpisodeForm {
  static submit(showId: string | number) {
    return TraktApiService.get<TraktShowNextEpisodeDto>(`/shows/${showId}/next_episode`, {
      extended: 'full'
    }).pipe(
      map(data => {
        if (typeof data === 'string') {
          return null;
        }
        return data;
      })
    );
  }
}
