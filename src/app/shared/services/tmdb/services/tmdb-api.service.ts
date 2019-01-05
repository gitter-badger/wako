import { BaseHttpService } from '../../http/base-http.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

export class TmdbApiService extends BaseHttpService {
  static queueEnabled = true;

  static getApiBaseUrl() {
    return environment.tmdb.baseUrl;
  }

  static getTimeToWaitOnTooManyRequest() {
    return 5 * 1000;
  }

  static getSimultaneousRequest() {
    return 4;
  }

  static get<T>(url: string, params?: any, cacheTime?: string): Observable<T> {
    if (!params) {
      params = {};
    }

    params['api_key'] = environment.tmdb.api_key;

    return super.get<T>(url, params, cacheTime);
  }
}
