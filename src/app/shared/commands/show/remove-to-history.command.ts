import { tap } from 'rxjs/operators';
import { EventCategory, EventName, EventService, EventShowHistoryChangeData } from '../../services/event.service';
import { TraktHistoryRemoveForm } from '../../services/trakt/forms/history/trakt-history-remove.form';

export class RemoveToHistoryCommand {
  static handle(showImdbId: string, showTitle: string, traktIds: number[], callOrigin?: string) {
    return TraktHistoryRemoveForm.submit({ episodeTraktIds: traktIds }).pipe(
      tap(() => {
        EventService.emit(EventCategory.showHistory, EventName.removeToHistory, <EventShowHistoryChangeData>{
          showImdbId: showImdbId,
          showTitle: showTitle,
          callOrigin: callOrigin
        });
      })
    );
  }
}
