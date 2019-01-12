import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KodiRemoteListPageComponent } from './kodi-remote-list/kodi-remote-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: KodiRemoteListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KodiRoutingModule {}
