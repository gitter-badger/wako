import { TraktApiService } from '../../services/trakt-api.service';
import { TraktMovieDto } from '../../dtos/movies/trakt-movie.dto';

export class TraktMoviesGetByIdForm {
  static submit(id: string | number) {
    return TraktApiService.get<TraktMovieDto>(
      `/movies/${id}`,
      {
        extended: 'full'
      },
      '1m'
    );
  }
}
