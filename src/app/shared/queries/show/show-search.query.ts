import { TraktShowsGetTrendingForm } from '../../services/trakt/forms/shows/trakt-shows-get-trending.form';
import { map } from 'rxjs/operators';
import { TraktShowToShowQuery } from '../trakt/show/trakt-show-to-show.query';
import { TraktShowsSearchForm } from '../../services/trakt/forms/shows/trakt-shows-search.form';

export class ShowSearchQuery {
  static getData(query: string, page: number) {
    if (query.length === 0) {
      return TraktShowsGetTrendingForm.submit(page, 20).pipe(
        map(trendingShows => {
          return trendingShows.map(trendingShow => {
            return TraktShowToShowQuery.getData(trendingShow.show);
          });
        })
      );
    }
    return TraktShowsSearchForm.submit(query, page).pipe(
      map(traktShows => {
        return traktShows.map(traktShow => {
          return TraktShowToShowQuery.getData(traktShow.show);
        });
      })
    );
  }
}
