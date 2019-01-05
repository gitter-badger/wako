import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraktStatsComponent } from './trakt-stats/trakt-stats.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TraktRoutingModule } from './trakt-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SharedModule, TraktRoutingModule],
  declarations: [TraktStatsComponent]
})
export class TraktModule {}
