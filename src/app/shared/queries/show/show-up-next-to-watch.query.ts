import { TraktShowsGetWatchedForm } from '../../services/trakt/forms/shows/trakt-shows-get-watched.form';
import { map, switchMap } from 'rxjs/operators';
import { TraktShowWatchedDto } from '../../services/trakt/dtos/shows/trakt-show-watched.dto';
import { TraktShowsGetProgressWatchedForm } from '../../services/trakt/forms/shows/trakt-shows-get-progress-watched.form';
import { NextEpisodeToWatch } from '../../entities/next-episode-to-watch';
import { forkJoin, of } from 'rxjs';
import { TmdbShowGetImagesQuery } from '../tmdb/show/tmdb-show-get-images.query';
import { TraktEpisodeToEpisodeQuery } from '../trakt/show/season/episode/trakt-episode-to-episode.query';
import { TraktUsersGetHiddenForm } from '../../services/trakt/forms/users/trakt-users-get-hidden.form';

export class ShowUpNextToWatchQuery {
  static getData() {
    return TraktUsersGetHiddenForm.submit('show').pipe(
      switchMap(hiddenShows => {
        const hiddenShowsImdId = [];
        hiddenShows.forEach(hiddenShow => hiddenShowsImdId.push(hiddenShow.show.ids.imdb));

        return TraktShowsGetWatchedForm.submit().pipe(
          map(shows => {
            const showsWithToWatch: TraktShowWatchedDto[] = [];

            shows.forEach(show => {
              if (hiddenShowsImdId.includes(show.show.ids.imdb)) {
                return;
              }

              const airedEpisodes = +show.show.aired_episodes;
              let totalWatched = 0;
              show.seasons.forEach(seasons => {
                totalWatched += seasons.episodes.length;
              });

              if (totalWatched < airedEpisodes) {
                showsWithToWatch.push(show);
              }
            });

            return showsWithToWatch;
          }),
          switchMap(shows => {
            const obss = [];
            const nextEpisodesToWatch: NextEpisodeToWatch[] = [];

            shows.forEach(show => {
              const nextEpisodeToWatch = {
                showImdbId: show.show.ids.imdb,
                showTitle: show.show.title,
                traktSeasonNumber: null,
                traktNumber: null,
                title: null,
                showPoster: null,
                code: null,
                url: null
              };

              // Do that here to keep order
              nextEpisodesToWatch.push(nextEpisodeToWatch);

              obss.push(
                TraktShowsGetProgressWatchedForm.submit(show.show.ids.imdb).pipe(
                  switchMap(traktShowProgressWatchedDto => {
                    if (!traktShowProgressWatchedDto.next_episode) {
                      return of(null);
                    }

                    return TmdbShowGetImagesQuery.getData(show.show.ids.tmdb).pipe(
                      map(images => {
                        nextEpisodeToWatch.traktSeasonNumber = traktShowProgressWatchedDto.next_episode.season;
                        nextEpisodeToWatch.traktNumber = traktShowProgressWatchedDto.next_episode.number;
                        nextEpisodeToWatch.title = traktShowProgressWatchedDto.next_episode.title;
                        nextEpisodeToWatch.showPoster = images.poster;
                        nextEpisodeToWatch.code = TraktEpisodeToEpisodeQuery.getEpisodeCode(
                          traktShowProgressWatchedDto.next_episode.season,
                          traktShowProgressWatchedDto.next_episode.number
                        );
                        nextEpisodeToWatch.url = `/shows/show/${show.show.ids.imdb}/seasons/${
                          traktShowProgressWatchedDto.next_episode.season
                        }/episodes/${traktShowProgressWatchedDto.next_episode.number}`;

                        return show;
                      })
                    );
                  })
                )
              );
            });

            return forkJoin(...obss).pipe(map(() => nextEpisodesToWatch));
          })
        );
      })
    );
  }
}
