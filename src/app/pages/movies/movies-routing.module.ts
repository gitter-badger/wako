import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailPageComponent } from './movie-detail/movie-detail-page.component';
import { MovieSearchListComponent } from './movie-search-list/movie-search-list.component';
import { MovieWishListPage } from './movie-wish-list/movie-wish-list.page';
import { MovieWatchedListComponent } from './movie-watched-list/movie-watched-list.component';

const routes: Routes = [
  {
    path: 'movie/trakt/:traktId',
    component: MovieDetailPageComponent
  },
  {
    path: 'movie/:imdbId',
    component: MovieDetailPageComponent
  },
  {
    path: 'search',
    component: MovieSearchListComponent
  },
  {
    path: 'wish-list',
    component: MovieWishListPage
  },
  {
    path: 'watched-list',
    component: MovieWatchedListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MoviesRoutingModule {}
