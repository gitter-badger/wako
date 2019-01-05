import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyShowsListPage } from './my-shows-list/my-shows-list.page';
import { ShowSeasonDetailPage } from './season-detail/show-season-detail.page';
import { EpisodeDetailPageComponent } from './episode-detail/episode-detail-page.component';
import { ShowSearchListPage } from './show-search-list/show-search-list.page';

const routes: Routes = [
  {
    path: 'my-shows',
    component: MyShowsListPage
  },
  {
    path: 'search',
    component: ShowSearchListPage
  },
  {
    path: 'show/:showImdbId',
    component: ShowSeasonDetailPage
  },
  {
    path: 'show/:showImdbId/seasons/:traktSeasonNumber/episodes/:traktNumber',
    component: EpisodeDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ShowsRoutingModule {}
