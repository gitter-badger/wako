import { TraktApiService } from '../../services/trakt-api.service';
import { TraktUserStatsDto } from '../../dtos/user/trakt-user-stats.dto';

export class TraktUsersStatsForm {
  static submit() {
    return TraktApiService.get<TraktUserStatsDto>(`/users/me/stats`);
  }
}
