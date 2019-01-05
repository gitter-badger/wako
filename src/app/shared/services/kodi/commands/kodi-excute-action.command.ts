import { KodiGuiGetPropertiesForm } from '../forms/gui/kodi-gui-get-properties.form';
import { switchMap } from 'rxjs/operators';
import { KodiInputExecuteActionForm } from '../forms/input/kodi-input-execute-action.form';

export class KodiExcuteActionCommand {
  static handle(action: string) {
    return KodiGuiGetPropertiesForm.submit().pipe(
      switchMap(() => {
        return KodiInputExecuteActionForm.submit(action);
      })
    );
  }
}
