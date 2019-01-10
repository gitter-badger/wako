import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Episode } from '../../../shared/entities/episode';
import { Show } from '../../../shared/entities/show';
import { ShowGetByImdbIdQuery } from '../../../shared/queries/show/show-get-by-imdb-id.query';
import { SeasonGetByImdbIdQuery } from '../../../shared/queries/show/season/season-get-by-imdb-id.query';
import { Season } from '../../../shared/entities/season';
import { TraktShowsGetProgressWatchedForm } from '../../../shared/services/trakt/forms/shows/trakt-shows-get-progress-watched.form';
import { Torrent } from '../../../shared/entities/torrent';
import { ElementumQueryParam } from '../../../shared/entities/elementum-query-param';
import { RemoveToHistoryCommand } from '../../../shared/commands/show/remove-to-history.command';
import { AddToHistoryCommand } from '../../../shared/commands/show/add-to-history.command';
import { ErrorToastService } from '../../../shared/services/app/error-toast.service';

@Component({
  templateUrl: 'episode-detail-page.component.html',
  styleUrls: ['./episode-detail-page.component.scss']
})
export class EpisodeDetailPageComponent implements OnInit {
  episode: Episode = null;

  show: Show = null;

  segment = 'torrents';

  torrents: Torrent[] = null;

  elementumQueryParam: ElementumQueryParam = {
    category: 'episode'
  };

  constructor(private route: ActivatedRoute, private errorToastService: ErrorToastService) {}

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
                      if (_episode.traktId === episode.traktId && watchedProgress.number === _episode.traktNumber) {
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
          this.errorToastService.create(`Failed to load show ${showImdbId}. Err: ${err.toString()}`);
        }
      );
    });
  }

  private init(show: Show, episode: Episode) {
    this.episode = episode;

    this.show = show;

    this.elementumQueryParam.tmdbShowId = show.tmdbId;
    this.elementumQueryParam.seasonNumber = episode.traktSeasonNumber;
    this.elementumQueryParam.episodeNumber = episode.traktNumber;
  }

  toggleWatched() {
    if (this.episode.watched) {
      RemoveToHistoryCommand.handle(this.show.imdbId, this.show.title, [this.episode.traktId]).subscribe();

      this.episode.watched = false;
    } else {
      AddToHistoryCommand.handle(this.show.imdbId, this.show.title, [this.episode.traktId]).subscribe();

      this.episode.watched = true;
    }
  }
}
