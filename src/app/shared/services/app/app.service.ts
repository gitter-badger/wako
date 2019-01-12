import { Storage } from '@ionic/storage';
import { Platform, ToastController } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from '../../../../environments/environment';
import { TraktApiService } from '../trakt/services/trakt-api.service';
import { HTTP } from '@ionic-native/http/ngx';
import { TraktOauthTokenForm } from '../trakt/forms/oauth/trakt-oauth-token.form';
import { TraktOauthRevokeForm } from '../trakt/forms/oauth/trakt-oauth-revoke.form';
import { HttpService } from '../http/http.service';
import { CacheService } from '../cache.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NavigationEnd, Router } from '@angular/router';
import { Firebase } from '@ionic-native/firebase/ngx';
import { TraktUsersMeForm } from '../trakt/forms/users/trakt-users-me.form';
import { EventCategory, EventService, EventShowHistoryChangeData } from '../event.service';
import { NotificationShowService } from './notification-show.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private redirect_uri = 'http://localhost';

  isAuthenticated$ = new ReplaySubject<boolean>(1);

  appVersion$ = new BehaviorSubject('');

  debugMode$ = new BehaviorSubject(false);

  notificationInitialized = false;

  errorsList: DebugItem[] = [];
  infoList: DebugItem[] = [];

  constructor(
    private iab: InAppBrowser,
    private storage: Storage,
    private ngZone: NgZone,
    private mobileHttpClient: HTTP,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private toastCtrl: ToastController,
    private appVersion: AppVersion,
    private router: Router,
    private firebase: Firebase,
    private notificationShowService: NotificationShowService
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.rewriteConsole();

      this.debugModeEnabled().then(debugMode => {
        if (debugMode) {
          this.debugMode$.next(true);
        }
      });

      HttpService.isMobileDevice = this.platform.is('cordova');

      HttpService.mobileHttpClient = this.mobileHttpClient;

      this.storage.get(environment.trakt.storageTokenKey).then(token => {
        TraktApiService.setToken(token);

        this.isAuthenticated$.next(token !== null);
      });

      if (this.platform.is('cordova')) {
        this.splashScreen.hide();

        this.appVersion.getVersionNumber().then(version => {
          this.appVersion$.next(version);
        });
      }

      this.initAnalytics();

      setTimeout(() => {
        CacheService.prune();
      }, 20000);

      this.isAuthenticated$.subscribe(isAuth => {
        if (isAuth) {
          this.notificationShowService.hasPermission().then(granted => {
            console.log('hasPermission', granted);
            if (granted) {
              this.initNotifications();
            }
          });
        }
      });
    });
  }

  private initNotifications() {
    if (this.notificationInitialized) {
      return;
    }
    this.notificationInitialized = true;

    console.log('initNotifications');

    this.notificationShowService.subscribeEvents();

    EventService.subscribe<EventShowHistoryChangeData>(EventCategory.showHistory).subscribe(event => {
      this.notificationShowService.setByShow(event.data.showImdbId).subscribe();
    });

    CacheService.get('notificationShowService.checkAllShows').subscribe(hasChecked => {
      if (!hasChecked) {
        this.notificationShowService.checkAllShows().subscribe(() => {
          CacheService.set('notificationShowService.checkAllShows', true, '1d');
        });
      } else {
        console.log('Check notification tomorrow');
      }
    });
  }

  login(): Observable<boolean | string> {
    return Observable.create(observer => {
      const url = `${environment.trakt.oauth2AuthorizeUrl}?response_type=code&client_id=${
        environment.trakt.client_id
      }&redirect_uri=${this.redirect_uri}`;

      let browserRef;

      const browserObservable = Observable.create(browserObserver => {
        if (!this.platform.is('cordova')) {
          browserRef = window.open(url, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');

          setTimeout(() => {
            const code = window.prompt('Code ?');
            browserObserver.next(code);
            browserObserver.complete();
          }, 12000);
        } else {
          browserRef = this.iab.create(url, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');

          browserRef.on('loadstart').subscribe(event => {
            if (event.url.indexOf(this.redirect_uri) === 0) {
              browserRef.close();

              const code = event.url.split('=')[1];

              browserObserver.next(code);
              browserObserver.complete();
            }
          });
        }
      });

      browserObservable.subscribe(code => {
        this.ngZone.run(() => {
          this.getAccessToken(code).subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        });
      });
    });
  }

  private getAccessToken(code): Observable<any> {
    return TraktOauthTokenForm.submit(
      code,
      environment.trakt.client_id,
      environment.trakt.client_secret,
      this.redirect_uri
    ).pipe(
      switchMap(tokenDataModel => {
        return fromPromise(
          this.storage.set(environment.trakt.storageTokenKey, tokenDataModel.access_token).then(() => {
            TraktApiService.setToken(tokenDataModel.access_token);

            this.toastCtrl
              .create({
                message: `If you're stuck on this page, please restart the app (known issue)`,
                duration: 4000
              })
              .then(toast => toast.present());

            this.isAuthenticated$.next(true);

            return tokenDataModel;
          })
        );
      })
    );
  }

  private initAnalytics() {
    this.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        TraktUsersMeForm.submit().subscribe(user => {
          if (user && this.platform.is('cordova')) {
            this.firebase.setUserId(user.ids.slug).then(() => {
              console.log('firebase: setUserId done');
            });
          }
        });
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.length > 0) {
        let screenName = 'HOME';

        if (event.url !== '/') {
          const urlParts = event.url.split('/');

          if (urlParts[1]) {
            screenName = urlParts[1].toUpperCase();

            if (urlParts[2]) {
              screenName += '_' + urlParts[2].toUpperCase();
            }
          }
        }
        console.log(`Screen name: ${screenName}`);

        if (this.platform.is('cordova')) {
          this.firebase.setScreenName(screenName);
          this.firebase.logEvent('Navigate', event.url);
        }
      }
    });
  }

  logout() {
    if (TraktApiService.getToken()) {
      return TraktOauthRevokeForm.submit(TraktApiService.getToken()).pipe(
        map(() => {
          this.storage.remove(environment.trakt.storageTokenKey);
          this.isAuthenticated$.next(false);
          return true;
        })
      );
    }
    return of(true);
  }

  async debugModeEnabled() {
    const debugMode = await this.storage.get('debugMode');

    return debugMode !== null;
  }

  async setDebugMode(debugMode: boolean) {
    this.debugMode$.next(debugMode);

    if (!debugMode) {
      return await this.storage.remove('debugMode');
    }
    return await this.storage.set('debugMode', true);
  }

  private async rewriteConsole() {
    const oldLog = console.log;
    const oldError = console.error;

    console.log = (...args) => {
      this.debugModeEnabled().then(debugMode => {
        oldLog(...args);

        if (!debugMode) {
          return;
        }

        const messages = [];

        args.forEach(arg => {
          let str = arg.toString();
          if (typeof arg === 'object') {
            str = JSON.stringify(arg);
          }
          messages.push(str);
        });
        this.infoList.push({
          date: new Date(),
          type: 'log',
          message: messages.join(' ')
        });
      });
    };

    console.error = (...args) => {
      this.debugModeEnabled().then(debugMode => {
        oldError(...args);

        if (!debugMode) {
          return;
        }

        const messages = [];

        args.forEach(arg => {
          let str = arg.toString();
          if (typeof arg === 'object') {
            str = JSON.stringify(arg);
          }
          messages.push(str);
        });
        this.errorsList.push({
          date: new Date(),
          type: 'error',
          message: messages.join(' ')
        });
      });
    };
  }
}

export interface DebugItem {
  date: Date;
  type: 'error' | 'log';
  message: string;
}
