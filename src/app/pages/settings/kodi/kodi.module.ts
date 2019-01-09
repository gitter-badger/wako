import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KodiRoutingModule } from './kodi-routing.module';
import { NgModule } from '@angular/core';
import { KodiSettingsPageComponent } from './kodi-settings/kodi-settings-page.component';
import { KodiRemoteListPageComponent } from './kodi-remote-list/kodi-remote-list-page.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, KodiRoutingModule, SharedModule],
  declarations: [KodiSettingsPageComponent, KodiRemoteListPageComponent]
})
export class KodiModule {}
