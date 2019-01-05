import { TraktApiService } from '../../services/trakt-api.service';
import { TraktUserMeDto } from '../../dtos/user/trakt-user-me.dto';

export class TraktUsersMeForm {
  static submit() {
    return TraktApiService.get<TraktUserMeDto>(`/users/me`);
  }
}
