import { Injectable } from '@angular/core';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { TraktShowsGetWatchedForm } from '../trakt/forms/shows/trakt-shows-get-watched.form';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, from, of, timer } from 'rxjs';
import { Platform } from '@ionic/angular';
import { TraktShowsGetNextEpisodeForm } from '../trakt/forms/shows/trakt-shows-get-next-episode.form';
import { TraktEpisodeToEpisodeQuery } from '../../queries/trakt/show/season/episode/trakt-episode-to-episode.query';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TraktShowWatchedDto } from '../trakt/dtos/shows/trakt-show-watched.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationShowService {
  constructor(
    private localNotifications: LocalNotifications,
    private platform: Platform,
    private router: Router,
    private storage: Storage
  ) {}

  private getNotificationIdFromImdbId(showImdbId: string) {
    return +showImdbId.replace('tt', '');
  }

  private clearAll() {
    if (!this.platform.is('cordova')) {
      return Promise.resolve(true);
    }

    return this.localNotifications.getAll().then(all => {
      const promises = [];
      all.forEach(notification => {
        if (notification.data.hasOwnProperty('showImdbId')) {
          promises.push(this.localNotifications.cancel(notification.id));
        }
      });

      return Promise.all(promises);
    });
  }

  hasPermission() {
    if (!this.platform.is('cordova')) {
      return Promise.resolve(true);
    }

    return this.localNotifications.hasPermission().then(granted => {
      if (granted) {
        return granted;
      } else {
        return this.localNotifications.requestPermission();
      }
    });
  }

  getSettings(): Promise<ShowsNotificationSettings> {
    return this.storage.get('notificationShowsSettings').then(settings => {
      if (!settings) {
        return <ShowsNotificationSettings>{
          enabled: true,
          enableOnlyIfUptToDate: true
        };
      }
      return settings;
    });
  }

  setSettings(settings: ShowsNotificationSettings) {
    return this.storage.set('notificationShowsSettings', settings).then(() => {
      if (settings.enabled === false) {
        if (this.platform.is('cordova')) {
          this.clearAll();
        }
      } else {
        this.checkAllShows().subscribe();
      }
    });
  }

  checkAllShows() {
    console.log('checkAllShows');

    return TraktShowsGetWatchedForm.submit().pipe(
      switchMap(shows => {
        const obss = [];
        let i = 1;
        shows.forEach(show => {
          const showImdbId = show.show.ids.imdb;

          obss.push(
            timer(5000 * i).pipe(
              switchMap(() => {
                return from(this.get(showImdbId)).pipe(
                  switchMap(notification => {
                    if (notification) {
                      // Has already a notification, skip it
                      console.log(show.show.title + ' has already a notification', notification.trigger.at);
                      return of(true);
                    }
                    return this.setByShow(showImdbId, show);
                  })
                );
              })
            )
          );
          i++;
        });

        return forkJoin(...obss);
      })
    );
  }

  get(showImdbId: string): Promise<ILocalNotification> {
    if (!this.platform.is('cordova')) {
      return Promise.resolve(null);
    }

    return this.localNotifications.getAll().then(all => {
      let notification: ILocalNotification = null;

      all.forEach(_notification => {
        if (_notification.data && _notification.data.showImdbId === showImdbId) {
          notification = _notification;
        }
      });

      return notification;
    });
  }

  private cancel(showImdbId: string) {
    console.log('Cancel notification', showImdbId);

    if (!this.platform.is('cordova')) {
      return Promise.resolve(true);
    }

    return this.get(showImdbId).then(notification => {
      if (notification) {
        console.log('Cancel notification', notification.title);
        return this.localNotifications.cancel(notification.id);
      }
      return false;
    });
  }

  private schedule(
    showImdbId: string,
    showTitle: string,
    episodeCode: string,
    episodeTitle: string,
    triggerAt: Date,
    episodeUrl: string
  ) {
    const options: ILocalNotification = {
      id: this.getNotificationIdFromImdbId(showImdbId),
      trigger: {
        at: triggerAt
      },
      title: 'New Episode: ' + showTitle + ' ' + episodeCode,
      text: episodeTitle,
      data: {
        showImdbId: showImdbId,
        url: episodeUrl
      },
      foreground: true
    };
    console.log(
      `Set notification for show ${options.data.showImdbId} ${options.title} at ${options.trigger.at} ${
        options.data.url
      }`
    );

    if (!this.platform.is('cordova')) {
      return;
    }

    return this.localNotifications.schedule(options);
  }

  /**
   * Set notification for a show
   */
  setByShow(showImdbId: string, traktShowWatchedDto?: TraktShowWatchedDto) {
    console.log('setByShow', showImdbId);

    let obs = of(traktShowWatchedDto);

    if (!traktShowWatchedDto) {
      obs = TraktShowsGetWatchedForm.submit().pipe(
        map(shows => {
          let show = null;

          shows.forEach(_show => {
            if (_show.show.ids.imdb === showImdbId) {
              show = _show;
            }
          });

          return show;
        })
      );
    }

    return from(this.getSettings()).pipe(
      switchMap(settings => {
        return obs.pipe(
          switchMap(show => {
            if (!show) {
              return from(this.cancel(showImdbId));
            } else {
              const airedEpisodes = +show.show.aired_episodes;
              let totalWatched = 0;
              show.seasons.forEach(seasons => {
                totalWatched += seasons.episodes.length;
              });

              if (!settings.enabled) {
                this.cancel(showImdbId);
                return of(null);
              }

              if (settings.enableOnlyIfUptToDate && totalWatched < airedEpisodes) {
                console.log(
                  `Still have ${airedEpisodes - totalWatched} episode(s) to watched before being notified`,
                  showImdbId,
                  show.show.title
                );
                this.cancel(showImdbId);
                return of(null);
              }

              return TraktShowsGetNextEpisodeForm.submit(showImdbId).pipe(
                switchMap(data => {
                  if (!data) {
                    console.log('No upcoming episode for', showImdbId, show.show.title);
                    return from(this.cancel(showImdbId));
                  }

                  const triggerAt = new Date(data.first_aired);
                  // const triggerAt = new Date();
                  // triggerAt.setMinutes(triggerAt.getMinutes() + 1);

                  const episodeTitle = data.title;
                  const episodeCode = TraktEpisodeToEpisodeQuery.getEpisodeCode(data.season, data.number);
                  const episodeUrl = `/shows/show/${showImdbId}/seasons/${data.season}/episodes/${data.number}`;

                  this.schedule(showImdbId, show.show.title, episodeCode, episodeTitle, triggerAt, episodeUrl);

                  return of(true);
                })
              );
            }
          })
        );
      })
    );
  }

  subscribeEvents() {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.localNotifications.on('click').subscribe((notification: ILocalNotification) => {
      const data = notification.data;
      console.log('notification click', data);

      if (data && data.url) {
        this.router.navigateByUrl(data.url);
      }
    });
  }
}

export interface ShowsNotificationSettings {
  enabled: boolean;
  enableOnlyIfUptToDate: boolean; // If user has watched all the aired episode
}
