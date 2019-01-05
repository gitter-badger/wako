import { TraktApiService } from '../../services/trakt-api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TraktHistoryStructure } from '../../sturctures/history/trakt-history.structure';

export class TraktHistoryRemoveForm {
  static submit(traktHistoryStructure: TraktHistoryStructure): Observable<boolean> {
    const body = {};
    if (traktHistoryStructure.movieImdbId) {
      body['movies'] = [
        {
          ids: {
            imdb: traktHistoryStructure.movieImdbId
          }
        }
      ];
    }

    if (traktHistoryStructure.episodeTraktIds) {
      body['episodes'] = traktHistoryStructure.episodeTraktIds.map(id => {
        return {
          ids: {
            trakt: id
          }
        };
      });
    }

    return TraktApiService.post<any>(`/sync/history/remove`, body).pipe(
      map(data => {
        if (traktHistoryStructure.movieImdbId) {
          return data.deleted.movies === 1;
        }
        if (traktHistoryStructure.episodeTraktIds) {
          return data.deleted.episodes === traktHistoryStructure.episodeTraktIds.length;
        }

        return false;
      })
    );
  }
}
