import { map, switchMap } from 'rxjs/operators';
import { TraktShowsGetByIdForm } from '../../services/trakt/forms/shows/trakt-shows-get-by-id.form';
import { TraktShowToShowQuery } from '../trakt/show/trakt-show-to-show.query';
import { TmdbShowGetImagesQuery } from '../tmdb/show/tmdb-show-get-images.query';
import { of } from 'rxjs';

export class ShowGetByImdbIdQuery {
  static getData(imdbId: string, getImage = true) {
    return TraktShowsGetByIdForm.submit(imdbId).pipe(
      switchMap(traktShowDto => {
        const show = TraktShowToShowQuery.getData(traktShowDto);

        if (!getImage) {
          return of(show);
        }
        return TmdbShowGetImagesQuery.getData(show.tmdbId).pipe(
          map(images => {
            show.images_url = images;

            return show;
          })
        );
      })
    );
  }
}
