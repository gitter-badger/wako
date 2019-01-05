import { map } from 'rxjs/operators';
import { TmdbTvGetByIdForm } from '../../../services/tmdb/forms/tv/tmdb-tv-get-by-id.form';

export class TmdbShowGetImagesQuery {
  private static getImageFromPath(path: string, size: number) {
    return `https://image.tmdb.org/t/p/w${size}${path}`;
  }

  static getData(tmdbId: number) {
    return TmdbTvGetByIdForm.submit(tmdbId).pipe(
      map(m => {
        if (!m) {
          return <ShowImage>{
            poster: 'assets/imgs/item-not-found.png',
            backdrop: ''
          };
        }
        return <ShowImage>{
          poster: this.getImageFromPath(m.poster_path, 300),
          backdrop: this.getImageFromPath(m.backdrop_path, 500)
        };
      })
    );
  }
}

export interface ShowImage {
  poster: string;
  backdrop: string;
}
