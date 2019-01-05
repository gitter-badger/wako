import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesRoutingModule } from './movies-routing.module';
import { IonicModule } from '@ionic/angular';
import { MovieListComponent } from './shared/components/movie-list/movie-list.component';
import { MovieItemComponent } from './shared/components/movie-item/movie-item.component';
import { MovieDetailPageComponent } from './movie-detail/movie-detail-page.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MovieSearchListComponent } from './movie-search-list/movie-search-list.component';
import { MovieWishListPage } from './movie-wish-list/movie-wish-list.page';
import { MovieWatchedListComponent } from './movie-watched-list/movie-watched-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MoviesRoutingModule, SharedModule],
  declarations: [
    MovieListComponent,
    MovieItemComponent,
    MovieDetailPageComponent,
    MovieSearchListComponent,
    MovieWishListPage,
    MovieWatchedListComponent
  ]
})
export class MoviesModule {}
