import { map } from 'rxjs/operators';
import { TraktShowsGetSeasonsByIdForm } from '../../../services/trakt/forms/shows/seasons/trakt-shows-get-seasons-by-id.form';
import { TraktSeasonToSeasonQuery } from '../../trakt/show/season/trakt-season-to-season.query';

export class SeasonGetByImdbIdQuery {
  static getData(imdbId: string) {
    return TraktShowsGetSeasonsByIdForm.submit(imdbId).pipe(
      map(traktShowSeasonDtos => {
        return traktShowSeasonDtos.map(traktShowSeasonDto => TraktSeasonToSeasonQuery.getData(traktShowSeasonDto));
      })
    );
  }
}
