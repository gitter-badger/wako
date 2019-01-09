import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KodiSettingsPageComponent } from './kodi-settings/kodi-settings-page.component';
import { KodiRemoteListPageComponent } from './kodi-remote-list/kodi-remote-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: KodiRemoteListPageComponent
  },
  {
    path: 'host',
    component: KodiSettingsPageComponent
  },
  {
    path: 'host/:host',
    component: KodiSettingsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KodiRoutingModule {}
