import { TraktApiService } from '../../../services/trakt-api.service';
import { TraktShowSeasonDto } from '../../../dtos/shows/seasons/trakt-show-season.dto';
import { map } from 'rxjs/operators';

export class TraktShowsGetSeasonsByIdForm {
  static submit(id: string) {
    return TraktApiService.get<TraktShowSeasonDto[]>(`/shows/${id}/seasons`, {
      extended: 'episodes,full'
    }).pipe(
      map((seasons: TraktShowSeasonDto[]) => {
        return seasons.filter(season => season.title !== 'Specials');
      })
    );
  }
}
