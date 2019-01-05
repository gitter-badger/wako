import { TraktApiService } from '../../services/trakt-api.service';

export class TraktOauthRevokeForm {
  static submit(token: string) {
    return TraktApiService.post('/oauth/revoke', { token: token });
  }
}
