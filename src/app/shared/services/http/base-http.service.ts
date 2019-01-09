import { catchError, finalize, map, share, timeout } from 'rxjs/operators';
import { NEVER, Observable, Observer, of, throwError, timer } from 'rxjs';
import { AjaxRequest } from 'rxjs/ajax';
import { HttpRequest, HttpResponse, HttpService } from './http.service';
import { CacheService } from '../cache.service';

interface QueueItem {
  observer: Observer<any>;
  observable: Observable<any>;
  url: string;
}

export class BaseHttpService {
  private static observableRequests = new Map();

  private static token: string;

  private static domainQueueItems = new Map<string, QueueItem[]>();

  static queueEnabled = false;

  static byPassCors = false;

  private static getDomain(url: string) {
    return url.replace(/http(s)?:\/\//gi, '').split('/')[0];
  }

  private static getQueueItemsByDomain(domain): QueueItem[] {
    if (!this.domainQueueItems.has(domain)) {
      this.domainQueueItems.set(domain, []);
    }

    return this.domainQueueItems.get(domain);
  }

  static getTimeToWaitOnTooManyRequest() {
    return 5000;
  }

  static getTimeToWaitBetweenEachRequest() {
    return 0;
  }

  static getSimultaneousRequest() {
    return 1;
  }

  static getApiBaseUrl() {
    return '';
  }

  static setToken(token: string) {
    this.token = token;
  }

  static getToken() {
    return this.token;
  }

  static getHeaders() {
    return {};
  }

  static handleError(err: any, url?: string) {
    console.log('handleError', err, url);
    // TODO Handle
    return throwError(err);
  }

  static getObservableKey(ajaxRequest: AjaxRequest) {
    const headerStr =
      ajaxRequest.headers && Object.keys(ajaxRequest.headers).length > 0
        ? '_h:' + JSON.stringify(ajaxRequest.headers)
        : '';
    const bodyStr =
      ajaxRequest.body && Object.keys(ajaxRequest.body).length > 0 ? '_b:' + JSON.stringify(ajaxRequest.body) : '';

    return `${ajaxRequest.method}::${ajaxRequest.url}${headerStr}${bodyStr}`;
  }

  static request<T>(
    httpRequest: HttpRequest,
    cacheTime?: string | number,
    timeoutMs = 10000,
    byPassCors = false,
    timeToWaitOnTooManyRequest?: number,
    timeToWaitBetweenEachRequest?: number
  ): Observable<T> {
    if (!httpRequest.headers) {
      httpRequest.headers = this.getHeaders();
    }

    if (!httpRequest.responseType) {
      httpRequest.responseType = 'json';
    }

    timeToWaitOnTooManyRequest = timeToWaitOnTooManyRequest || this.getTimeToWaitOnTooManyRequest();
    timeToWaitBetweenEachRequest = timeToWaitBetweenEachRequest || this.getTimeToWaitBetweenEachRequest();

    const domain = this.getDomain(httpRequest.url);

    const observableKey = this.getObservableKey(httpRequest);

    let obs = this.observableRequests.get(observableKey);

    if (!obs) {
      obs = Observable.create(observer => {
        let cacheObs = of(null);
        if (cacheTime) {
          cacheObs = CacheService.get<T>(observableKey);
        }

        cacheObs.subscribe(cache => {
          if (cache) {
            observer.next(cache);
            observer.complete();

            return;
          }
          const queueObs = HttpService.request(httpRequest, this.byPassCors || byPassCors).pipe(
            timeout(timeoutMs),
            map((response: HttpResponse) => {
              if (cacheTime) {
                CacheService.set(observableKey, response.response, cacheTime);
              }

              return response.response as T;
            }),
            catchError(err => {
              if (err.status === 429) {
                if (this.queueEnabled) {
                  this.addToQueue(domain, observer, queueObs, httpRequest.url);
                  console.log('Gonna wait', timeToWaitOnTooManyRequest, 'ms before continue, on domain', domain);
                  timer(timeToWaitOnTooManyRequest).subscribe(() => {
                    console.log('RUN NEXT', domain);
                    this.runNext(domain, timeToWaitBetweenEachRequest);
                  });
                } else {
                  console.log('Queue is disabled do nothing');
                }

                return NEVER;
              }

              return this.handleError(err, httpRequest.url);
            })
          );

          if (this.queueEnabled) {
            this.addToQueue(domain, observer, queueObs, httpRequest.url);
            if (this.getQueueItemsByDomain(domain).length <= this.getSimultaneousRequest()) {
              this.runNext(domain, timeToWaitBetweenEachRequest);
            }
          } else {
            queueObs.subscribe(
              result => {
                observer.next(result);
                observer.complete();
              },
              err => {
                observer.error(err);
              }
            );
          }
        });
      }).pipe(share());

      this.observableRequests.set(observableKey, obs);
    }

    return obs;
  }

  private static addToQueue(domain: string, observer: Observer<any>, observable: Observable<any>, url: string) {
    this.getQueueItemsByDomain(domain).push({
      observer: observer,
      observable: observable,
      url: url
    });
  }

  private static runNext(domain: string, timeToWaitBetweenEachRequest: number) {
    const queueItems = this.getQueueItemsByDomain(domain);

    if (queueItems.length > 0) {
      const data = queueItems[0];
      queueItems.shift();

      data.observable
        .pipe(
          finalize(() => {
            setTimeout(() => {
              this.runNext(domain, timeToWaitBetweenEachRequest);
            }, timeToWaitBetweenEachRequest);
          })
        )
        .subscribe(
          result => {
            data.observer.next(result);
            data.observer.complete();
          },
          err => {
            data.observer.error(err);
          }
        );
    }
  }

  static get<T>(url: string, params?: any, cacheTime?: string, timeoutMs = 10000): Observable<T> {
    return this.request<T>(
      {
        url: this.getApiBaseUrl() + HttpService.addParamsToUrl(url, params),
        method: 'GET'
      },
      cacheTime,
      timeoutMs
    );
  }

  static post<T>(url: string, body: Object, cacheTime?: string, timeoutMs = 10000): Observable<T> {
    return this.request<T>(
      {
        url: this.getApiBaseUrl() + url,
        method: 'POST',
        body: body
      },
      cacheTime,
      timeoutMs
    );
  }

  static put<T>(url: string, body: Object, cacheTime?: string, timeoutMs = 10000): Observable<T> {
    return this.request<T>(
      {
        url: this.getApiBaseUrl() + url,
        method: 'PUT',
        body: body
      },
      cacheTime,
      timeoutMs
    );
  }

  static delete<T>(url: string, body: Object, cacheTime?: string, timeoutMs = 10000): Observable<T> {
    return this.request<T>(
      {
        url: this.getApiBaseUrl() + url,
        method: 'DELETE',
        body: body
      },
      cacheTime,
      timeoutMs
    );
  }
}
