import { TraktApiService } from '../../services/trakt-api.service';

export class TraktShowsGetProgressWatchedForm {
  static submit(id: string) {
    return TraktApiService.get<TraktShowProgressWatchedDto>(`/shows/${id}/progress/watched`);
  }
}
