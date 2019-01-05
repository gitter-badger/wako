import { TraktShowsGetWatchedForm } from '../../services/trakt/forms/shows/trakt-shows-get-watched.form';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ShowGetByImdbIdQuery } from './show-get-by-imdb-id.query';

export class MyShowsQuery {
  static getData() {
    return TraktShowsGetWatchedForm.submit().pipe(
      switchMap(traktShowsWatchedDtos => {
        const obs = [];

        traktShowsWatchedDtos.forEach(traktShowsWatchedDto => {
          const ob = ShowGetByImdbIdQuery.getData(traktShowsWatchedDto.show.ids.imdb, false);

          obs.push(ob);
        });

        return forkJoin(...obs);
      })
    );
  }
}
