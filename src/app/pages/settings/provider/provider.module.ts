import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProviderRoutingModule } from './provider-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProviderSetJsonComponent } from './provider-set-json/provider-set-json.component';

@NgModule({
  declarations: [ProviderListComponent, ProviderSetJsonComponent],
  entryComponents: [ProviderSetJsonComponent],
  imports: [CommonModule, FormsModule, IonicModule, ProviderRoutingModule, SharedModule]
})
export class ProviderModule {}
