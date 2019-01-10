import { defer, Observable } from 'rxjs';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';

export class HttpService {
  static isMobileDevice: boolean;

  static mobileHttpClient: HTTP;

  static request(httpRequest: HttpRequest, needToByPassCorsOnMobile = true): Observable<HttpResponse> {
    let obs: Observable<HttpResponse>;

    if (this.isMobileDevice) {
      // } && needToByPassCorsOnMobile) {
      obs = this.mobileRequest(httpRequest);
    } else {
      obs = this.browserRequest(httpRequest);
    }

    return obs.pipe(
      map(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response;
        }
        throw <HttpError>{
          request: response.response.request,
          status: response.status,
          responseType: response.responseType,
          response: response.response
        };
      })
    );
  }

  private static mobileRequest(httpRequest: HttpRequest): Observable<HttpResponse> {
    return defer(() => {
      this.mobileHttpClient.setDataSerializer('json');

      let promise;

      if (httpRequest.method === 'GET') {
        promise = this.mobileHttpClient.get(httpRequest.url, {}, httpRequest.headers);
      } else if (httpRequest.method === 'POST') {
        promise = this.mobileHttpClient.post(httpRequest.url, httpRequest.body, httpRequest.headers);
      } else if (httpRequest.method === 'DELETE') {
        promise = this.mobileHttpClient.delete(httpRequest.url, httpRequest.body, httpRequest.headers);
      } else {
        throw new Error('httpRequest.method  not set');
      }

      return promise.then(
        (response: HTTPResponse) => {
          const ajaxResponse = <HttpResponse>{
            request: httpRequest,
            responseText: response.data,
            status: response.status,
            responseType: httpRequest.responseType,
            response: response
          };

          try {
            ajaxResponse.response = ajaxResponse.responseType === 'json' ? JSON.parse(response.data) : response.data;
          } catch (e) {
            ajaxResponse.response = '';
          }

          return ajaxResponse;
        },
        (response: HTTPResponse) => {
          throw <HttpError>{
            request: httpRequest,
            status: response.status,
            responseType: httpRequest.responseType,
            response: response.error
          };
        }
      );
    });
  }

  private static browserRequest(httpRequest: HttpRequest): Observable<HttpResponse> {
    const headers = new Headers();
    if (httpRequest.headers) {
      for (const key in httpRequest.headers) {
        headers.set(key, httpRequest.headers[key]);
      }
    }

    return defer(() => {
      return fetch(httpRequest.url, {
        method: httpRequest.method,
        body: httpRequest.body ? JSON.stringify(httpRequest.body) : null,
        headers: headers
      }).then(
        (response: Response) => {
          const ajaxResponse = <HttpResponse>{
            request: httpRequest,
            responseText: null,
            status: response.status,
            responseType: httpRequest.responseType,
            response: response
          };
          const contentType = response.headers.get('content-type');

          if (contentType && contentType.includes('application/json')) {
            return response.json().then(json => {
              ajaxResponse.response = json;

              return ajaxResponse;
            });
          } else {
            return response.text().then(text => {
              try {
                ajaxResponse.response =
                  httpRequest.responseType === 'json' && text.length > 0 ? JSON.parse(text) : text;
              } catch (e) {
                ajaxResponse.response = text;
              }

              return ajaxResponse;
            });
          }
        },
        (response: HTTPResponse) => {
          throw <HttpError>{
            request: httpRequest,
            status: response.status,
            responseType: httpRequest.responseType,
            response: response.error
          };
        }
      );
    });
  }

  static addParamsToUrl(url: string, params: any) {
    if (params) {
      const searchParams = new URLSearchParams('');

      for (const key in params) {
        if (params[key]) {
          searchParams.set(key, params[key]);
        }
      }

      url += (url.match(/\?/) ? '&' : '?') + decodeURIComponent(searchParams.toString());
    }

    return url;
  }
}

export interface HttpRequest {
  url?: string;
  body?: any;
  method?: string;
  headers?: Object;
  responseType?: string;
}

export interface HttpError extends Error {
  /** The AjaxRequest associated with the error */
  request: HttpRequest;

  /** The HTTP status code */
  status: number;

  /** The responseType (e.g. 'json', 'arraybuffer', or 'xml') */
  responseType: string;

  /**  {string|ArrayBuffer|Document|object|any} The response data */
  response: any;
}

/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 */
export interface HttpResponse {
  /** The HTTP status code */
  status: number;

  /** {string|ArrayBuffer|Document|object|any} The response data */
  response: any;

  /** The raw responseText */
  responseText: string;

  /** The responseType (e.g. 'json', 'arraybuffer', or 'xml') */
  responseType: string;
}
