import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from '../../shared/services/app/guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'kodi',
    canActivate: [AuthGuard],
    loadChildren: './kodi/kodi.module#KodiModule'
  },
  {
    path: 'providers',
    canActivate: [AuthGuard],
    loadChildren: './provider/provider.module#ProviderModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
