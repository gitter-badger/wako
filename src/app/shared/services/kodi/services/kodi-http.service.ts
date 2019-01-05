import { BaseHttpService } from '../../http/base-http.service';
import { KodiHostStructure } from '../structures/kodi-host.structure';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class KodiHttpService extends BaseHttpService {
  private static apiBaseUrl = '';

  static host: KodiHostStructure;

  static byPassCors = true;

  static getApiBaseUrl() {
    return this.apiBaseUrl;
  }

  static setHost(host: KodiHostStructure) {
    this.host = host;
    this.apiBaseUrl = `http://${host.host}:${host.port}/jsonrpc`;
  }

  static getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  static doAction<T>(method: string, params?: any, timeoutMs = 2000): Observable<T> {
    const action: KodiAction = {
      jsonrpc: '2.0',
      id: 1,
      method: method
    };

    if (params) {
      action.params = params;
    }

    console.log('method', method, timeoutMs);
    return this.post<KodiActionResult<T>>(`?${method}`, action, null, timeoutMs).pipe(map(data => data.result));
  }
}

interface KodiAction {
  jsonrpc: string;
  id: number;
  method: string;
  params?: any;
}

export interface KodiActionResult<T> {
  id: number;
  jsonrpc: string;
  result: T;
}
