import { Component, OnDestroy, OnInit } from '@angular/core';
import { Show } from '../../../shared/entities/show';
import { Torrent } from '../../../shared/entities/torrent';
import { Season } from '../../../shared/entities/season';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserService } from '../../../shared/services/app/browser.service';
import { ShowGetByImdbIdQuery } from '../../../shared/queries/show/show-get-by-imdb-id.query';
import { NavController, ToastController } from '@ionic/angular';
import { Episode } from '../../../shared/entities/episode';
import { TraktShowsGetProgressWatchedForm } from '../../../shared/services/trakt/forms/shows/trakt-shows-get-progress-watched.form';
import { SeasonGetByImdbIdQuery } from '../../../shared/queries/show/season/season-get-by-imdb-id.query';
import { EventCategory, EventService, EventShowHistoryChangeData } from '../../../shared/services/event.service';
import { RemoveToHistoryCommand } from '../../../shared/commands/show/remove-to-history.command';
import { AddToHistoryCommand } from '../../../shared/commands/show/add-to-history.command';
import { filter } from 'rxjs/operators';
import { NotificationShowService } from '../../../shared/services/app/notification-show.service';

@Component({
  templateUrl: 'show-season-detail.page.html',
  styleUrls: ['show-season-detail.page.scss']
})
export class ShowSeasonDetailPage implements OnInit, OnDestroy {
  show: Show = null;
  torrents: Torrent[] = [];

  displaySeasonEpisodes = {};

  isAiredEpisodes = {};

  segment = 'seasons';

  seasons: Season[] = [];

  doIWatchThisShow = false;

  initialized = false;

  private eventSubscriber;

  private traktEventServiceAction = 'ShowSeasonDetailPage';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private browserService: BrowserService,
    private notificationShowService: NotificationShowService
  ) {}

  ngOnDestroy() {
    if (this.eventSubscriber) {
      this.eventSubscriber.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      const imdbId = data.get('showImdbId');

      ShowGetByImdbIdQuery.getData(imdbId).subscribe(
        show => {
          this.init(show);
        },
        err => {
          this.showNotFound();
        }
      );
    });
  }

  private showNotFound() {
    this.toastCtrl
      .create({
        message: 'Show not found on trakt,',
        duration: 3000
      })
      .then(toast => toast.present());
  }

  init(show: Show) {
    this.show = show;

    this.notificationShowService.get(this.show.imdbId).then(notification => {
      if (!notification) {
        console.log(`No notification scheduled for ${this.show.title}`);
      } else {
        console.log(`Next notification for ${this.show.title} will be at ${notification.trigger.at}`);
      }
    });

    this.initialized = false;

    this.eventSubscriber = EventService.subscribe<EventShowHistoryChangeData>(EventCategory.showHistory)
      .pipe(filter(event => event.data.showImdbId === this.show.imdbId))
      .subscribe(event => {
        if (event.data.callOrigin !== this.traktEventServiceAction) {
          this.getSeasons();
        }
      });

    this.getSeasons();
  }

  private getWatched() {
    TraktShowsGetProgressWatchedForm.submit(this.show.imdbId).subscribe(traktShowProgressWatchedDto => {
      this.seasons.forEach(season => {
        season.totalEpisodesWatched = 0;

        season.episodes.forEach(episode => {
          episode.watched = false;
        });

        traktShowProgressWatchedDto.seasons.forEach(watchedProgressSeason => {
          if (watchedProgressSeason.number === season.traktNumber) {
            season.totalEpisodesWatched = watchedProgressSeason.completed;

            watchedProgressSeason.episodes.forEach(watchedProgress => {
              season.episodes.forEach(episode => {
                if (watchedProgress.number === episode.traktNumber) {
                  episode.watched = watchedProgress.completed;
                }
              });
            });
          }
        });
      });

      this.setTotalEpisodesWatched();

      this.initialized = true;
    });
  }

  private setTotalEpisodesWatched() {
    this.show.totalEpisodesWatched = 0;

    this.seasons.forEach(season => {
      this.show.totalEpisodesWatched += season.totalEpisodesWatched;
    });

    this.doIWatchThisShow = this.show.totalEpisodesWatched > 0;
  }

  private getSeasons() {
    SeasonGetByImdbIdQuery.getData(this.show.imdbId).subscribe((seasons: Season[]) => {
      seasons.forEach(season => {
        if (typeof this.displaySeasonEpisodes[season.traktNumber] === 'undefined') {
          this.displaySeasonEpisodes[season.traktNumber] = false;
        }

        season.episodes.forEach(episode => {
          this.isAiredEpisodes[episode.code] = this.isAired(episode);
        });
      });
      this.seasons = seasons.reverse();

      this.getWatched();
    });
  }

  private isAired(episode: Episode) {
    return episode.firstAired.getTime() < Date.now() && episode.firstAired.getFullYear() > 1970;
  }

  goToEpisodeDetail(episode: Episode) {
    this.navCtrl.navigateForward(
      `/shows/show/${this.show.imdbId}/seasons/${episode.traktSeasonNumber}/episodes/${episode.traktNumber}`
    );
  }

  showTrailer() {
    this.browserService.open(`http://www.imdb.com/title/${this.show.imdbId}/`);
  }

  toggleWatchEpisode(event: MouseEvent, season: Season, episode: Episode) {
    event.stopImmediatePropagation();

    let obs = null;

    if (episode.watched) {
      obs = RemoveToHistoryCommand.handle(
        this.show.imdbId,
        this.show.title,
        [episode.traktId],
        this.traktEventServiceAction
      );

      season.totalEpisodesWatched--;
      episode.watched = false;
    } else {
      obs = AddToHistoryCommand.handle(
        this.show.imdbId,
        this.show.title,
        [episode.traktId],
        this.traktEventServiceAction
      );

      season.totalEpisodesWatched++;
      episode.watched = true;
    }

    this.setTotalEpisodesWatched();

    obs.subscribe(done => {
      if (!done) {
        this.getWatched();
      }
    });
  }

  toggleWatchSeason(event: MouseEvent, season: Season) {
    event.stopImmediatePropagation();

    let obs = null;

    if (season.totalEpisodesWatched === season.episodeCount) {
      const traktIds = [];

      season.episodes.forEach(episode => {
        traktIds.push(episode.traktId);
        episode.watched = false;
      });

      season.totalEpisodesWatched = 0;

      obs = RemoveToHistoryCommand.handle(this.show.imdbId, this.show.title, traktIds, this.traktEventServiceAction);
    } else {
      const traktIds = [];

      season.episodes.forEach(episode => {
        if (!episode.watched) {
          traktIds.push(episode.traktId);
          episode.watched = true;
        }
      });
      season.totalEpisodesWatched = season.episodeCount;

      obs = AddToHistoryCommand.handle(this.show.imdbId, this.show.title, traktIds, this.traktEventServiceAction);
    }

    this.setTotalEpisodesWatched();

    obs.subscribe(done => {
      if (!done) {
        this.getWatched();
      }
    });
  }

  removeShow() {
    const traktIds = [];

    this.seasons.forEach(season => {
      season.episodes.forEach(episode => {
        traktIds.push(episode.traktId);
        episode.watched = false;
      });

      season.totalEpisodesWatched = 0;
    });

    RemoveToHistoryCommand.handle(this.show.imdbId, this.show.title, traktIds, this.traktEventServiceAction).subscribe(
      done => {
        if (!done) {
          this.getWatched();
        }
      }
    );

    this.doIWatchThisShow = false;

    this.setTotalEpisodesWatched();
  }
}
