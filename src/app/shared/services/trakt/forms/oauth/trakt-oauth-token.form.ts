import { TraktApiService } from '../../services/trakt-api.service';
import { TraktOauthTokenDto } from '../../dtos/oauth/trakt-oauth-token.dto';

export class TraktOauthTokenForm {
  static submit(code: string, client_id: string, client_secret: string, redirect_uri: string) {
    return TraktApiService.post<TraktOauthTokenDto>('/oauth/token', {
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    });
  }
}
