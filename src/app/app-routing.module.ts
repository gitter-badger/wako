import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnAuthGuard } from './shared/services/app/guard/un-auth-guard.service';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './shared/services/app/guard/auth-guard.service';
import { SearchTorrentComponent } from './pages/torrents/search-torrent/search-torrent.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'login',
    canActivate: [UnAuthGuard],
    component: LoginComponent
  },
  {
    path: 'search-provider',
    canActivate: [AuthGuard],
    component: SearchTorrentComponent
  },
  {
    path: 'movies',
    canActivate: [AuthGuard],
    loadChildren: './pages/movies/movies.module#MoviesModule'
  },
  {
    path: 'shows',
    canActivate: [AuthGuard],
    loadChildren: './pages/shows/shows.module#ShowsModule'
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: './pages/settings/settings.module#SettingsModule'
  }

  // {
  //   path: '**',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
