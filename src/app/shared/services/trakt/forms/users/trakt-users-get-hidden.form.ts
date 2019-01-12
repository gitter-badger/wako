import { TraktApiService } from '../../services/trakt-api.service';
import { TraktUserHiddenItemDto } from '../../dtos/user/trakt-user-hidden-item.dto';

export class TraktUsersGetHiddenForm {
  static submit(type: 'movies' | 'show') {
    return TraktApiService.get<TraktUserHiddenItemDto[]>(`/users/hidden/progress_watched?${type}`);
  }
}
