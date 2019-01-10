import { TraktHistoryAddForm } from '../../services/trakt/forms/history/trakt-history-add.form';
import { tap } from 'rxjs/operators';
import { EventCategory, EventName, EventService, EventShowHistoryChangeData } from '../../services/event.service';

export class AddToHistoryCommand {
  static handle(showImdbId: string, showTitle: string, traktIds: number[], callOrigin?: string) {
    return TraktHistoryAddForm.submit({ episodeTraktIds: traktIds }).pipe(
      tap(() => {
        EventService.emit(EventCategory.showHistory, EventName.addToHistory, <EventShowHistoryChangeData>{
          showImdbId: showImdbId,
          showTitle: showTitle,
          callOrigin: callOrigin
        });
      })
    );
  }
}
