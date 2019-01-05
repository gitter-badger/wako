import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowsRoutingModule } from './shows-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MyShowsListPage } from './my-shows-list/my-shows-list.page';
import { ShowListComponent } from './shared/components/show-list/show-list.component';
import { ShowItemComponent } from './shared/components/show-item/show-item.component';
import { ShowSeasonDetailPage } from './season-detail/show-season-detail.page';
import { EpisodeDetailPageComponent } from './episode-detail/episode-detail-page.component';
import { ShowSearchListPage } from './show-search-list/show-search-list.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ShowsRoutingModule, SharedModule],
  declarations: [
    ShowItemComponent,
    ShowListComponent,
    MyShowsListPage,
    ShowSearchListPage,
    ShowSeasonDetailPage,
    EpisodeDetailPageComponent
  ]
})
export class ShowsModule {}
