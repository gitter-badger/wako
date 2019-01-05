import { BaseHttpService } from '../../http/base-http.service';
import { environment } from '../../../../../environments/environment';

export class TraktApiService extends BaseHttpService {
  static getApiBaseUrl() {
    return environment.trakt.baseUrl;
  }

  static getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'trakt-api-version': environment.trakt.version,
      'trakt-api-key': environment.trakt.client_id
    };

    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    return headers;
  }
}
