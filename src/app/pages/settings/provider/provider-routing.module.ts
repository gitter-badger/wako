import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderSetJsonComponent } from './provider-set-json/provider-set-json.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderListComponent
  },
  {
    path: 'list',
    component: ProviderListComponent
  },
  {
    path: 'set-json',
    component: ProviderSetJsonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProviderRoutingModule {}
