import { TraktApiService } from '../../services/trakt-api.service';
import { TraktMoviesWatchedDto } from '../../dtos/movies/trakt-movies-watched.dto';

export class TraktMoviesGetWatchedForm {
  static submit() {
    return TraktApiService.get<TraktMoviesWatchedDto[]>(`/users/me/watched/movies`);
  }
}
