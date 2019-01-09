import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SharedModule, SettingsRoutingModule],
  declarations: [SettingsComponent]
})
export class SettingsModule {}
