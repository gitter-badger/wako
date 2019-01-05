import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraktStatsComponent } from './trakt-stats/trakt-stats.component';

const routes: Routes = [
  {
    path: '',
    component: TraktStatsComponent
  },
  {
    path: 'stats',
    component: TraktStatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraktRoutingModule {}
