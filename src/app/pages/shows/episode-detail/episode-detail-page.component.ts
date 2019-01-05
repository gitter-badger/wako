import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Episode } from '../../../shared/entities/episode';
import { Show } from '../../../shared/entities/show';
import { ShowGetByImdbIdQuery } from '../../../shared/queries/show/show-get-by-imdb-id.query';
import { SeasonGetByImdbIdQuery } from '../../../shared/queries/show/season/season-get-by-imdb-id.query';
import { Season } from '../../../shared/entities/season';
import { TraktHistoryRemoveForm } from '../../../shared/services/trakt/forms/history/trakt-history-remove.form';
import { TraktHistoryAddForm } from '../../../shared/services/trakt/forms/history/trakt-history-add.form';
import { TraktShowsGetProgressWatchedForm } from '../../../shared/services/trakt/forms/shows/trakt-shows-get-progress-watched.form';
import { TraktEventService } from '../../../shared/services/trakt/services/trakt-event.service';
import { Torrent } from '../../../shared/entities/torrent';

@Component({
  templateUrl: 'episode-detail-page.component.html',
  styleUrls: ['./episode-detail-page.component.scss']
})
export class EpisodeDetailPageComponent implements OnInit {
  episode: Episode = null;

  show: Show = null;

  segment = 'torrents';

  torrents: Torrent[] = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      const showImdbId = data.get('showImdbId');
      const traktSeasonNumber = data.get('traktSeasonNumber');
      const traktNumber = data.get('traktNumber');

      ShowGetByImdbIdQuery.getData(showImdbId).subscribe(
        show => {
          SeasonGetByImdbIdQuery.getData(showImdbId).subscribe((seasons: Season[]) => {
            const season = seasons.filter(_season => +_season.traktNumber === +traktSeasonNumber).pop();
            const episode = season.episodes.filter(_episode => +_episode.traktNumber === +traktNumber).pop();

            TraktShowsGetProgressWatchedForm.submit(showImdbId).subscribe(traktShowProgressWatchedDto => {
              traktShowProgressWatchedDto.seasons.forEach(watchedProgressSeason => {
                if (watchedProgressSeason.number === season.traktNumber) {
                  season.totalEpisodesWatched = watchedProgressSeason.completed;

                  watchedProgressSeason.episodes.forEach(watchedProgress => {
                    season.episodes.forEach(_episode => {
                      if (watchedProgress.number === _episode.traktNumber) {
                        episode.watched = watchedProgress.completed;
                      }
                    });
                  });
                }
              });
            });

            this.init(show, episode);
          });
        },
        err => {
          console.error(err);
        }
      );
    });
  }

  private init(show: Show, episode: Episode) {
    this.episode = episode;

    this.show = show;
  }

  toggleWatched() {
    if (this.episode.watched) {
      TraktHistoryRemoveForm.submit({ episodeTraktIds: [this.episode.traktId] }).subscribe(() => {
        TraktEventService.emit(this.show.imdbId);
      });

      this.episode.watched = false;
    } else {
      TraktHistoryAddForm.submit({ episodeTraktIds: [this.episode.traktId] }).subscribe(() => {
        TraktEventService.emit(this.show.imdbId);
      });

      this.episode.watched = true;
    }
  }
}
